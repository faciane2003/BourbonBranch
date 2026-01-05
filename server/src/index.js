const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { initDb } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl: databaseUrl?.includes("render.com")
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === "production" && databaseUrl
      ? { rejectUnauthorized: false }
      : false
});

pool.on("error", (error) => {
  console.error("Unexpected database idle client error:", error);
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const retryableCodes = new Set([
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "57P01",
  "57P02",
  "57P03",
  "53300",
  "55000",
  "08006",
  "08001"
]);

const isRetryableError = (error) => {
  if (!error) {
    return false;
  }
  if (retryableCodes.has(error.code)) {
    return true;
  }
  const message = String(error.message || "");
  return message.includes("terminating connection") || message.includes("timeout");
};

const initDbWithRetry = async (retries = 5) => {
  let attempt = 0;
  while (true) {
    try {
      await initDb(pool);
      return;
    } catch (error) {
      if (!isRetryableError(error) || attempt >= retries) {
        throw error;
      }
      attempt += 1;
      console.warn(
        `DB init retry ${attempt}/${retries} after error:`,
        error.code || error.message
      );
      await sleep(500 * attempt);
    }
  }
};

const queryWithRetry = async (text, params, { retries = 2, delayMs = 250 } = {}) => {
  let attempt = 0;
  while (true) {
    try {
      return await pool.query(text, params);
    } catch (error) {
      if (!isRetryableError(error) || attempt >= retries) {
        throw error;
      }
      attempt += 1;
      console.warn(
        `DB query retry ${attempt}/${retries} after error:`,
        error.code || error.message
      );
      await sleep(delayMs * attempt);
    }
  }
};

const getClientWithRetry = async ({ retries = 2, delayMs = 250 } = {}) => {
  let attempt = 0;
  while (true) {
    try {
      return await pool.connect();
    } catch (error) {
      if (!isRetryableError(error) || attempt >= retries) {
        throw error;
      }
      attempt += 1;
      console.warn(
        `DB connect retry ${attempt}/${retries} after error:`,
        error.code || error.message
      );
      await sleep(delayMs * attempt);
    }
  }
};

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/health/db", async (req, res) => {
  const start = Date.now();
  try {
    await queryWithRetry("SELECT 1");
    res.json({ ok: true, latencyMs: Date.now() - start });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({ ok: false });
  }
});

app.get("/api/products", async (req, res) => {
  const scope = req.query.scope || "items";
  try {
    const result = await queryWithRetry(
      "SELECT * FROM products WHERE scope = $1 ORDER BY id DESC",
      [scope]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await queryWithRetry(
      `
        SELECT c.id,
               c.first_name AS "firstName",
               c.last_name AS "lastName",
               c.position,
               c.mobile,
               COUNT(o.id) AS "orderCount"
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        GROUP BY c.id
        ORDER BY c.id
      `
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load customers:", error);
    res.status(500).json({ error: "Failed to load customers" });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const result = await queryWithRetry(
      `
        SELECT o.id AS "orderId",
               o.created_at AS "createdAt",
               c.id AS "customerId",
               c.first_name AS "firstName",
               c.last_name AS "lastName",
               c.position,
               c.mobile,
               oi.quantity AS quantity,
               p.id AS "productId",
               p.name AS "productName",
               p.category AS "productCategory",
               p.price AS "productPrice",
               p.stock AS "productStock"
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        LEFT JOIN order_items oi ON oi.order_id = o.id
        LEFT JOIN products p ON p.id = oi.product_id
        ORDER BY o.id, oi.id
      `
    );

    const orderMap = new Map();

    result.rows.forEach((row) => {
      if (!orderMap.has(row.orderId)) {
        orderMap.set(row.orderId, {
          id: row.orderId,
          createdAt: row.createdAt,
          customer: {
            id: row.customerId,
            firstName: row.firstName,
            lastName: row.lastName,
            position: row.position,
            mobile: row.mobile
          },
          products: []
        });
      }

      if (row.productId) {
        orderMap.get(row.orderId).products.push({
          quantity: row.quantity,
          product: {
            id: row.productId,
            name: row.productName,
            category: row.productCategory,
            price: row.productPrice,
            stock: row.productStock
          }
        });
      }
    });

    res.json(Array.from(orderMap.values()));
  } catch (error) {
    console.error("Failed to load orders:", error);
    res.status(500).json({ error: "Failed to load orders" });
  }
});

app.post("/api/products", async (req, res) => {
  const { name, category, price, stock, needed, status, scope, data } =
    req.body || {};
  const normalizedScope = scope || "items";
  const normalizedData = data && typeof data === "object" ? data : {};

  let normalizedName = name;
  let normalizedCategory = category;
  let normalizedPrice = price;
  let normalizedStock = stock;
  let normalizedNeeded = needed === undefined ? 0 : needed;
  let normalizedStatus = status || "full";

  if (normalizedScope === "items") {
    if (!normalizedName || !normalizedCategory || normalizedPrice === undefined || normalizedStock === undefined) {
      return res.status(400).json({ error: "Missing product fields" });
    }
  } else {
    const dataKeys = Object.keys(normalizedData || {});
    const primaryValue = dataKeys.length ? normalizedData[dataKeys[0]] : "";
    normalizedName =
      normalizedName || String(primaryValue || "").trim() || "Untitled";
    normalizedCategory = normalizedCategory || "General";
    normalizedPrice = normalizedPrice === undefined ? 0 : normalizedPrice;
    normalizedStock = normalizedStock === undefined ? 0 : normalizedStock;
    normalizedNeeded =
      normalizedNeeded === undefined ? 0 : normalizedNeeded;
    normalizedStatus = normalizedStatus || "full";
  }

  try {
    const result = await queryWithRetry(
      `
        INSERT INTO products (name, category, price, stock, needed, status, scope, data)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `,
      [
        normalizedName,
        normalizedCategory,
        normalizedPrice,
        normalizedStock,
        normalizedNeeded,
        normalizedStatus,
        normalizedScope,
        normalizedData
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock, needed, status, scope, data } =
    req.body || {};
  const normalizedData = data && typeof data === "object" ? data : {};

  try {
    let existing = null;
    if (scope !== "items") {
      const existingResult = await queryWithRetry(
        "SELECT * FROM products WHERE id = $1",
        [id]
      );
      if (existingResult.rowCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      existing = existingResult.rows[0];
    }

    const normalizedScope = scope || existing?.scope || "items";
    const mergedData =
      normalizedScope === "items"
        ? normalizedData
        : { ...(existing?.data || {}), ...(normalizedData || {}) };

    let normalizedName = name ?? existing?.name;
    let normalizedCategory = category ?? existing?.category;
    let normalizedPrice = price ?? existing?.price;
    let normalizedStock = stock ?? existing?.stock;
    let normalizedNeeded =
      needed === undefined ? existing?.needed ?? 0 : needed;
    let normalizedStatus = status || existing?.status || "full";

    if (normalizedScope === "items") {
      if (!normalizedName || !normalizedCategory || normalizedPrice === undefined || normalizedStock === undefined) {
        return res.status(400).json({ error: "Missing product fields" });
      }
    } else {
      const dataKeys = Object.keys(mergedData || {});
      const primaryValue = dataKeys.length ? mergedData[dataKeys[0]] : "";
      normalizedName =
        normalizedName || String(primaryValue || "").trim() || "Untitled";
      normalizedCategory = normalizedCategory || "General";
      normalizedPrice = normalizedPrice === undefined ? 0 : normalizedPrice;
      normalizedStock = normalizedStock === undefined ? 0 : normalizedStock;
      normalizedNeeded =
        normalizedNeeded === undefined ? 0 : normalizedNeeded;
      normalizedStatus = normalizedStatus || "full";
    }

    const result = await queryWithRetry(
      `
        UPDATE products
        SET name = $1,
            category = $2,
            price = $3,
            stock = $4,
            needed = $5,
            status = $6,
            scope = $7,
            data = $8
        WHERE id = $9
        RETURNING *
      `,
      [
        normalizedName,
        normalizedCategory,
        normalizedPrice,
        normalizedStock,
        normalizedNeeded,
        normalizedStatus,
        normalizedScope,
        mergedData,
        id
      ]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usage = await queryWithRetry(
      "SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1",
      [id]
    );
    if (usage.rowCount > 0) {
      return res
        .status(409)
        .json({ error: "Product is used by existing orders" });
    }
    const result = await queryWithRetry(
      "DELETE FROM products WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

app.post("/api/customers", async (req, res) => {
  const { firstName, lastName, position, mobile } = req.body || {};
  if (!firstName) {
    return res.status(400).json({ error: "Missing customer first name" });
  }
  try {
    const result = await queryWithRetry(
      `
        INSERT INTO customers (first_name, last_name, position, mobile)
        VALUES ($1, $2, $3, $4)
        RETURNING id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  position,
                  mobile
      `,
      [firstName, lastName || "", position || "", mobile || ""]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create customer:", error);
    res.status(500).json({ error: "Failed to create customer" });
  }
});

app.put("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, position, mobile } = req.body || {};
  if (!firstName) {
    return res.status(400).json({ error: "Missing customer first name" });
  }
  try {
    const result = await queryWithRetry(
      `
        UPDATE customers
        SET first_name = $1,
            last_name = $2,
            position = $3,
            mobile = $4
        WHERE id = $5
        RETURNING id,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  position,
                  mobile
      `,
      [firstName, lastName || "", position || "", mobile || "", id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update customer:", error);
    res.status(500).json({ error: "Failed to update customer" });
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usage = await queryWithRetry(
      "SELECT 1 FROM orders WHERE customer_id = $1 LIMIT 1",
      [id]
    );
    if (usage.rowCount > 0) {
      return res
        .status(409)
        .json({ error: "Customer has existing orders" });
    }
    const result = await queryWithRetry(
      "DELETE FROM customers WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

app.post("/api/orders", async (req, res) => {
  const { customerId, items } = req.body || {};
  if (!customerId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing order fields" });
  }
  const client = await getClientWithRetry();
  try {
    await client.query("BEGIN");

    const customer = await client.query(
      "SELECT id FROM customers WHERE id = $1",
      [customerId]
    );
    if (customer.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Customer not found" });
    }

    const orderResult = await client.query(
      "INSERT INTO orders (customer_id) VALUES ($1) RETURNING id",
      [customerId]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity)
          VALUES ($1, $2, $3)
        `,
        [orderId, item.productId, item.quantity]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ id: orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
});

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { customerId, items } = req.body || {};
  if (!customerId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Missing order fields" });
  }
  const client = await getClientWithRetry();
  try {
    await client.query("BEGIN");

    const order = await client.query("SELECT id FROM orders WHERE id = $1", [
      id
    ]);
    if (order.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Order not found" });
    }

    await client.query(
      "UPDATE orders SET customer_id = $1 WHERE id = $2",
      [customerId, id]
    );
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    for (const item of items) {
      await client.query(
        `
          INSERT INTO order_items (order_id, product_id, quantity)
          VALUES ($1, $2, $3)
        `,
        [id, item.productId, item.quantity]
      );
    }

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to update order:", error);
    res.status(500).json({ error: "Failed to update order" });
  } finally {
    client.release();
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await queryWithRetry(
      "DELETE FROM orders WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

const port = process.env.PORT || 5171;
initDbWithRetry()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
