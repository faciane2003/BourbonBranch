const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const { initDb } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

const databaseUrl = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production" && databaseUrl
      ? { rejectUnauthorized: false }
      : false
});

app.get("/api/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id");
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to load products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query(
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
    const result = await pool.query(
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
  const { name, category, price, stock } = req.body || {};
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Missing product fields" });
  }
  try {
    const result = await pool.query(
      `
        INSERT INTO products (name, category, price, stock)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
      [name, category, price, stock]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body || {};
  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Missing product fields" });
  }
  try {
    const result = await pool.query(
      `
        UPDATE products
        SET name = $1, category = $2, price = $3, stock = $4
        WHERE id = $5
        RETURNING *
      `,
      [name, category, price, stock, id]
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
    const usage = await pool.query(
      "SELECT 1 FROM order_items WHERE product_id = $1 LIMIT 1",
      [id]
    );
    if (usage.rowCount > 0) {
      return res
        .status(409)
        .json({ error: "Product is used by existing orders" });
    }
    const result = await pool.query(
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
    const result = await pool.query(
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
    const result = await pool.query(
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
    const usage = await pool.query(
      "SELECT 1 FROM orders WHERE customer_id = $1 LIMIT 1",
      [id]
    );
    if (usage.rowCount > 0) {
      return res
        .status(409)
        .json({ error: "Customer has existing orders" });
    }
    const result = await pool.query(
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
  const client = await pool.connect();
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
  const client = await pool.connect();
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
    const result = await pool.query(
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
initDb(pool)
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    process.exit(1);
  });
