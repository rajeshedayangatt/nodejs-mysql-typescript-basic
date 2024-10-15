import express, { Request, Response } from "express";
import { checkConnection, pool } from "./db";

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json()); // Enable JSON body parsing

/*
 * Fetch all products
 */
app.get("/api/products", async (req, res) => {
  try {
    const [rows, fields] = await pool.query(
      "SELECT `id`, `name` FROM `products`"
    );

    if (Array.isArray(rows)) {
      const result = rows.map((row) => {
        return {
          id: (row as any).id,
          name: (row as any).name,
        };
      });

      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching the products" }); // Send error response
  }
});

/*
 * Delete a product
 */
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query("DELETE FROM `products` WHERE `id` = ?", [id]);
    res.status(201).json({ message: "product deleted" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" }); // Send error response  }
  }
});

/*
 * insert new  product
 */
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, category_id, description } = req.body;

    console.log(name, price, category_id, description);

    const result = await pool.query(
      "INSERT INTO `products` (`name`, `price`, `category_id`, `description`) VALUES (?, ?, ?, ?)",
      [name, price, category_id, description]
    );

    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while adding the product" }); // Send error response
  }
});

/*
 * update the  product
 */
app.put("/api/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, price, category_id, description } = req.body;

    const [result] = await pool.query(
      "UPDATE `products` SET `name` = ?, `price` = ?, `category_id` = ?, `description` = ? WHERE `id` = ?",
      [name, price, category_id, description, id]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Product not found" }); // If no rows affected, respond with a 404
      //
    } else {
      res.status(201).json({ message: "Product updated" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the product" }); // Handle errors
    console.log(err);
  }
});

// Server listening
app.listen(PORT, () => {
  checkConnection();
  console.log(`Server is running on http://localhost:${PORT}`);
});
