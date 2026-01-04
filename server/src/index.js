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
