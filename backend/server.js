const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 1010;

// middleware
app.use(cors());
app.use(express.json());

// database
const db = new sqlite3.Database("./inventory.db");

db.run(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        qty INTEGER
    )
`);

// GET all / search
app.get("/items", (req, res) => {
    const search = req.query.search || "";
    db.all(
        "SELECT * FROM items WHERE name LIKE ?",
        [`%${search}%`],
        (err, rows) => {
            if (err) return res.status(500).send(err.message);
            res.json(rows);
        }
    );
});

// POST add
app.post("/items", (req, res) => {
    const { name, qty } = req.body;
    db.run(
        "INSERT INTO items (name, qty) VALUES (?, ?)",
        [name, qty],
        () => res.json({ status: "created" })
    );
});

// PUT update
app.put("/items/:id", (req, res) => {
    const { name, qty } = req.body;
    db.run(
        "UPDATE items SET name=?, qty=? WHERE id=?",
        [name, qty, req.params.id],
        () => res.json({ status: "updated" })
    );
});

// DELETE
app.delete("/items/:id", (req, res) => {
    db.run(
        "DELETE FROM items WHERE id=?",
        [req.params.id],
        () => res.json({ status: "deleted" })
    );
});

const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 1010;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

