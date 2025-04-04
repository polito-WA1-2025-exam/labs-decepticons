// for the first lab's content only
import sqlite from "sqlite3";
import express from "express";

const db = new sqlite.Database("ourDb.sqlite", (err) => {
  if (err) throw err;
});
("use strict");
console.log("Starting database setup...");
// Define table creation queries
const CREATE_TABLES = [
  `CREATE TABLE IF NOT EXISTS foods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity INTEGER NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS surpriseBags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foods TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS regularBags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        foods TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS bags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bags TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS stores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        type TEXT NOT NULL
    );`,
  `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phoneNumber TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );`,
];

// Function to run queries sequentially using Promises
function runQuery(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Ensure all tables are created before proceeding
let tableCreationPromise = CREATE_TABLES.reduce((promiseChain, query) => {
  return promiseChain.then(() => runQuery(query));
}, Promise.resolve());

function Food(name, quantity) {
  this.name = name;
  this.quantity = quantity;
  this.addFoodToDb = () => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO foods(name, quantity) VALUES(?, ?)",
        [name, quantity],
        (err) => {
          if (err) reject(err);
          else resolve(`Food added: ${this.name}`);
        }
      );
    });
  };

  this.removeFoodFromDb = new Promise((resolve, reject) => {
    db.run("DELETE FROM foods WHERE name = ?", [this.name], (err) => {
      if (err) reject(err);
      else resolve(`Food removed: ${this.name}`);
    });
  });

  this.updateFoodInDb = new Promise((resolve, reject) => {
    db.run(
      "UPDATE foods SET quantity = ? WHERE name = ?",
      [this.quantity, this.name],
      (err) => {
        if (err) reject(err);
        else resolve(`Food updated: ${this.name}, Quantity: ${this.quantity}`);
      }
    );
  });

  this.getFoodFromDb = new Promise((resolve, reject) => {
    db.get("SELECT * FROM foods WHERE name = ?", [this.name], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function surpriseBag() {
  this.bag = [];
  this.add = function (foodName, quantity) {
    this.bag.push(new Food(foodName, quantity));
  };
  this.get = function (foodName) {
    return this.bag.find((food) => food.name === foodName);
  };
  this.add = function (food) {
    this.bag.push(food);
  };
  this.remove = function (foodName) {
    this.bag = this.bag.filter((food) => food.name !== foodName);
  };
  this.sortByQuantity = function () {
    this.bag.sort((a, b) => a.quantity - b.quantity);
  };
  this.addBagToDb = function () {
    db.run(
      "INSERT INTO surpriseBags(foods) VALUES(?)",
      [JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.removeBagFromDb = function () {
    db.run(
      "DELETE FROM surpriseBags WHERE foods = ?",
      [JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.updateBagInDb = function () {
    db.run(
      "UPDATE surpriseBags SET foods = ? WHERE foods = ?",
      [JSON.stringify(this.bag), JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.getBagFromDb = function () {
    db.get(
      "SELECT * FROM surpriseBags WHERE foods = ?",
      [JSON.stringify(this.bag)],
      (err, row) => {
        if (err) throw err;
        this.bag = JSON.parse(row.foods);
      }
    );
  };
}

function regularBag() {
  this.bag = [];
  this.add = function (foodName, quantity) {
    this.bag.push(new Food(foodName, quantity));
  };
  this.add = function (food) {
    this.bag.push(food);
  };
  this.get = function (foodName) {
    return this.bag.find((food) => food.name === foodName);
  };
  this.remove = function (foodName) {
    this.bag = this.bag.filter((food) => food.name !== foodName);
  };
  this.sortByQuantity = function () {
    this.bag.sort((a, b) => a.quantity - b.quantity);
  };
  this.addBagToDb = function () {
    db.run(
      "INSERT INTO regularBags(foods) VALUES(?)",
      [JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.removeBagFromDb = function () {
    db.run(
      "DELETE FROM regularBags WHERE foods = ?",
      [JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.updateBagInDb = function () {
    db.run(
      "UPDATE regularBags SET foods = ? WHERE foods = ?",
      [JSON.stringify(this.bag), JSON.stringify(this.bag)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.getBagFromDb = function () {
    db.get(
      "SELECT * FROM regularBags WHERE foods = ?",
      [JSON.stringify(this.bag)],
      (err, row) => {
        if (err) throw err;
        this.bag = JSON.parse(row.foods);
      }
    );
  };
}

function Bags() {
  this.bags = [];
  this.add = function (item) {
    this.bags.push(item);
  };
  this.list = function () {
    return this.bags;
  };
  this.get = function (index) {
    return this.bags[index];
  };
  this.remove = function (index) {
    this.bags.splice(index, 1);
  };
  this.sortByType = function () {
    this.bags.sort((a, b) => a.type.localeCompare(b.type));
  };
  this.addBagsToDb = function () {
    db.run(
      "INSERT INTO bags(bags) VALUES(?)",
      [JSON.stringify(this.bags)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.removeBagsFromDb = function () {
    db.run(
      "DELETE FROM bags WHERE bags = ?",
      [JSON.stringify(this.bags)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.updateBagsInDb = function () {
    db.run(
      "UPDATE bags SET bags = ? WHERE bags = ?",
      [JSON.stringify(this.bags), JSON.stringify(this.bags)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.getBagsFromDb = function () {
    db.get(
      "SELECT * FROM bags WHERE bags = ?",
      [JSON.stringify(this.bags)],
      (err, row) => {
        if (err) throw err;
        this.bags = JSON.parse(row.bags);
      }
    );
  };
}

function Store(name, address, phoneNumber, type) {
  this.name = name;
  this.address = address;
  this.phoneNumber = phoneNumber;
  this.type = type;
  this.addStoreToDb = function () {
    db.run(
      "INSERT INTO stores(name, address, phoneNumber, type) VALUES(?, ?, ?, ?)",
      [this.name, this.address, this.phoneNumber, this.type],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.removeStoreFromDb = function () {
    db.run("DELETE FROM stores WHERE name = ?", [this.name], (err) => {
      if (err) throw err;
    });
  };
  this.updateStoreInDb = function () {
    db.run(
      "UPDATE stores SET address = ?, phoneNumber = ?, type = ? WHERE name = ?",
      [this.address, this.phoneNumber, this.type, this.name],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.getStoreFromDb = function () {
    db.get("SELECT * FROM stores WHERE name = ?", [this.name], (err, row) => {
      if (err) throw err;
      this.address = row.address;
      this.phoneNumber = row.phoneNumber;
      this.type = row.type;
    });
  };
}

function User(name, address, phoneNumber, username, password) {
  this.name = name;
  this.address = address;
  this.phoneNumber = phoneNumber;
  this.username = username;
  this.password = password;

  this.login = function (inputUsername, inputPassword) {
    return this.username === inputUsername && this.password === inputPassword;
  };
  this.addUserToDb = new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO users(name, address, phoneNumber, username, password) VALUES(?, ?, ?, ?, ?)",
      [this.name, this.address, this.phoneNumber, this.username, this.password],
      (err) => {
        if (err) reject(err);
        else resolve(`User added: ${this.username}`);
      }
    );
  });

  this.removeUserFromDb = new Promise((resolve, reject) => {
    db.run("DELETE FROM users WHERE username = ?", [this.username], (err) => {
      if (err) reject(err);
      else resolve(`User removed: ${this.username}`);
    });
  });

  this.updateUserInDb = new Promise((resolve, reject) => {
    db.run(
      "UPDATE users SET password = ? WHERE username = ?",
      [this.password, this.username],
      (err) => {
        if (err) reject(err);
        else resolve(`User updated: ${this.username}`);
      }
    );
  });

  this.getUserFromDb = new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM users WHERE username = ?",
      [this.username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
}

function Users() {
  this.users = [];
  this.add = function (user) {
    this.users.push(user);
  };
  this.get = function (username) {
    return this.users.find((user) => user.username === username);
  };
  this.remove = function (username) {
    this.users = this.users.filter((user) => user.username !== username);
  };
  this.sortByName = function () {
    this.users.sort((a, b) => a.name.localeCompare(b.name));
  };
  this.addUsersToDb = function () {
    db.run(
      "INSERT INTO users(users) VALUES(?)",
      [JSON.stringify(this.users)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.removeUsersFromDb = function () {
    db.run(
      "DELETE FROM users WHERE users = ?",
      [JSON.stringify(this.users)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.updateUsersInDb = function () {
    db.run(
      "UPDATE users SET users = ? WHERE users = ?",
      [JSON.stringify(this.users), JSON.stringify(this.users)],
      (err) => {
        if (err) throw err;
      }
    );
  };
  this.getUsersFromDb = function () {
    db.get(
      "SELECT * FROM users WHERE users = ?",
      [JSON.stringify(this.users)],
      (err, row) => {
        if (err) throw err;
        this.users = JSON.parse(row.users);
      }
    );
  };
}

tableCreationPromise
  .then(() => {
    return new Food("apple", 5).addFoodToDb();
  })
  .then(() => {
    return new Food("melon", 3).addFoodToDb();
  })
  .catch((err) => console.error("Error:", err));

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// Retrieve the list of all items of the main collection (foods)
app.get("/api/foods", (req, res) => {
  db.all("SELECT * FROM foods", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Retrieve a list of items with specific characteristics (e.g., quantity > 0)
app.get("/api/foods/filter", (req, res) => {
  const { quantity } = req.query;
  db.all(
    "SELECT * FROM foods WHERE quantity > ?",
    [quantity || 0],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Retrieve a specific item by id
app.get("/api/foods/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM foods WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Food not found" });
    res.json(row);
  });
});

// Create a new item
app.post("/api/foods", (req, res) => {
  const { name, quantity } = req.body;
  if (!name || quantity == null)
    return res.status(400).json({ error: "Invalid input" });
  db.run(
    "INSERT INTO foods (name, quantity) VALUES (?, ?)",
    [name, quantity],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, quantity });
    }
  );
});

// Update an existing item
app.put("/api/foods/:id", (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  if (!name || quantity == null)
    return res.status(400).json({ error: "Invalid input" });
  db.run(
    "UPDATE foods SET name = ?, quantity = ? WHERE id = ?",
    [name, quantity, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0)
        return res.status(404).json({ error: "Food not found" });
      res.json({ id, name, quantity });
    }
  );
});

// Update specific attributes of a specific item
app.patch("/api/foods/:id", (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updates), id];
  db.run(`UPDATE foods SET ${fields} WHERE id = ?`, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Food not found" });
    res.json({ id, ...updates });
  });
});

// Delete an existing item
app.delete("/api/foods/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM foods WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: "Food not found" });
    res.status(204).end();
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Test CRUD endpoints
const testCRUD = async () => {
  const baseUrl = "http://localhost:3000/api/foods";

  try {
    // Create a new food item
    let response = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "banana", quantity: 10 }),
    });
    let data = await response.json();
    console.log("Created:", data);

    // Retrieve all food items
    response = await fetch(baseUrl);
    data = await response.json();
    console.log("All Foods:", data);

    // Retrieve a specific food item by ID
    const foodId = data[0]?.id; // Assuming the first item exists
    response = await fetch(`${baseUrl}/${foodId}`);
    data = await response.json();
    console.log("Retrieved Food:", data);

    // Update the food item
    response = await fetch(`${baseUrl}/${foodId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "banana", quantity: 20 }),
    });
    data = await response.json();
    console.log("Updated Food:", data);

    // Partially update the food item
    response = await fetch(`${baseUrl}/${foodId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: 25 }),
    });
    data = await response.json();
    console.log("Partially Updated Food:", data);

    // Delete the food item
    response = await fetch(`${baseUrl}/${foodId}`, { method: "DELETE" });
    if (response.status === 204) console.log("Deleted Food:", foodId);

    // Verify deletion
    response = await fetch(`${baseUrl}/${foodId}`);
    if (response.status === 404) console.log("Food not found after deletion");
  } catch (error) {
    console.error("Error during CRUD tests:", error);
  }
};

// Run the test
testCRUD();
