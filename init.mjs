// for the first lab's content only
import sqlite from 'sqlite3';

const db = new sqlite.Database('ourDb.sqlite', (err) => { if (err) throw err })
"use strict";
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
    );`
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
            db.run('INSERT INTO foods(name, quantity) VALUES(?, ?)', [this.name, this.quantity], (err) => {
                if (err) reject(err);
                else resolve(`Food added: ${this.name}`);
            });
        });
    } 

    this.removeFoodFromDb = new Promise((resolve, reject) => {
        db.run('DELETE FROM foods WHERE name = ?', [this.name], (err) => {
            if (err) reject(err);
            else resolve(`Food removed: ${this.name}`);
        });
    });

    this.updateFoodInDb = new Promise((resolve, reject) => {
        db.run('UPDATE foods SET quantity = ? WHERE name = ?', [this.quantity, this.name], (err) => {
            if (err) reject(err);
            else resolve(`Food updated: ${this.name}, Quantity: ${this.quantity}`);
        });
    });

    this.getFoodFromDb = new Promise((resolve, reject) => {
        db.get('SELECT * FROM foods WHERE name = ?', [this.name], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function surpriseBag() {
    this.bag = [];
    this.add = function(foodName, quantity) {
        this.bag.push(new Food(foodName, quantity));
    }
    this.get = function(foodName) {
        return this.bag.find(food => food.name === foodName);
    }
    this.add = function(food) {
        this.bag.push(food);
    }
    this.remove = function(foodName) {
        this.bag = this.bag.filter(food => food.name !== foodName);
    }
    this.sortByQuantity = function() {
        this.bag.sort((a, b) => a.quantity - b.quantity);
    }
    this.addBagToDb = function() {
        db.run('INSERT INTO surpriseBags(foods) VALUES(?)', [JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }
    this.removeBagFromDb = function() {
        db.run('DELETE FROM surpriseBags WHERE foods = ?', [JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }   
    this.updateBagInDb = function() {
        db.run('UPDATE surpriseBags SET foods = ? WHERE foods = ?', [JSON.stringify(this.bag), JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }
    this.getBagFromDb = function() {
        db.get('SELECT * FROM surpriseBags WHERE foods = ?', [JSON.stringify(this.bag)], (err, row) => {
            if (err) throw err;
            this.bag = JSON.parse(row.foods);
        });
    }
}

function regularBag() {
    this.bag = [];
    this.add = function(foodName, quantity) {
        this.bag.push(new Food(foodName, quantity));
    }
    this.add = function(food) {
        this.bag.push(food);
    }
    this.get = function(foodName) {
        return this.bag.find(food => food.name === foodName);
    }
    this.remove = function(foodName) {
        this.bag = this.bag.filter(food => food.name !== foodName);
    }
    this.sortByQuantity = function() {
        this.bag.sort((a, b) => a.quantity - b.quantity);
    }
    this.addBagToDb = function() {
        db.run('INSERT INTO regularBags(foods) VALUES(?)', [JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }
    this.removeBagFromDb = function() {
        db.run('DELETE FROM regularBags WHERE foods = ?', [JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }   
    this.updateBagInDb = function() {
        db.run('UPDATE regularBags SET foods = ? WHERE foods = ?', [JSON.stringify(this.bag), JSON.stringify(this.bag)], (err) => { if (err) throw err });
    }
    this.getBagFromDb = function() {
        db.get('SELECT * FROM regularBags WHERE foods = ?', [JSON.stringify(this.bag)], (err, row) => {
            if (err) throw err;
            this.bag = JSON.parse(row.foods);
        });
    }
}

function Bags() {
    this.bags = [];
    this.add = function(item) {
        this.bags.push(item);
    }
    this.list = function() {
        return this.bags;
    }
    this.get = function(index) {
        return this.bags[index];
    }
    this.remove = function(index) {
        this.bags.splice(index, 1);
    }
    this.sortByType = function() {
        this.bags.sort((a, b) => a.type.localeCompare(b.type));
    }
    this.addBagsToDb = function() {
        db.run('INSERT INTO bags(bags) VALUES(?)', [JSON.stringify(this.bags)], (err) => { if (err) throw err });
    }
    this.removeBagsFromDb = function() {
        db.run('DELETE FROM bags WHERE bags = ?', [JSON.stringify(this.bags)], (err) => { if (err) throw err });
    }
    this.updateBagsInDb = function() {
        db.run('UPDATE bags SET bags = ? WHERE bags = ?', [JSON.stringify(this.bags), JSON.stringify(this.bags)], (err) => { if (err) throw err });
    }
    this.getBagsFromDb = function() {
        db.get('SELECT * FROM bags WHERE bags = ?', [JSON.stringify(this.bags)], (err, row) => {
            if (err) throw err;
            this.bags = JSON.parse(row.bags);
        });
    }
}

function Store(name, address, phoneNumber, type) {
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.type = type;
    this.addStoreToDb = function() {
        db.run('INSERT INTO stores(name, address, phoneNumber, type) VALUES(?, ?, ?, ?)', [this.name, this.address, this.phoneNumber, this.type], (err) => { if (err) throw err });
    }       
    this.removeStoreFromDb = function() {
        db.run('DELETE FROM stores WHERE name = ?', [this.name], (err) => { if (err) throw err });
    }
    this.updateStoreInDb = function() {
        db.run('UPDATE stores SET address = ?, phoneNumber = ?, type = ? WHERE name = ?', [this.address, this.phoneNumber, this.type, this.name], (err) => { if (err) throw err });
    }
    this.getStoreFromDb = function() {
        db.get('SELECT * FROM stores WHERE name = ?', [this.name], (err, row) => {
            if (err) throw err;
            this.address = row.address;
            this.phoneNumber = row.phoneNumber;
            this.type = row.type;
        });
    }
}

function User(name, address, phoneNumber, username, password) {
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.username = username;
    this.password = password;

    this.login = function(inputUsername, inputPassword) {
        return this.username === inputUsername && this.password === inputPassword;
    }
    this.addUserToDb = new Promise((resolve, reject) => {
        db.run('INSERT INTO users(name, address, phoneNumber, username, password) VALUES(?, ?, ?, ?, ?)',
            [this.name, this.address, this.phoneNumber, this.username, this.password],
            (err) => {
                if (err) reject(err);
                else resolve(`User added: ${this.username}`);
            }
        );
    });

    this.removeUserFromDb = new Promise((resolve, reject) => {
        db.run('DELETE FROM users WHERE username = ?', [this.username], (err) => {
            if (err) reject(err);
            else resolve(`User removed: ${this.username}`);
        });
    });

    this.updateUserInDb = new Promise((resolve, reject) => {
        db.run('UPDATE users SET password = ? WHERE username = ?', [this.password, this.username], (err) => {
            if (err) reject(err);
            else resolve(`User updated: ${this.username}`);
        });
    });

    this.getUserFromDb = new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [this.username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function Users() {
    this.users = [];
    this.add = function(user) {
        this.users.push(user);
    }
    this.get = function(username) {
        return this.users.find(user => user.username === username);
    }
    this.remove = function(username) {
        this.users = this.users.filter(user => user.username !== username);
    }
    this.sortByName = function() {
        this.users.sort((a, b) => a.name.localeCompare(b.name));
    }
    this.addUsersToDb = function() {
        db.run('INSERT INTO users(users) VALUES(?)', [JSON.stringify(this.users)], (err) => { if (err) throw err });
    }
    this.removeUsersFromDb = function() {
        db.run('DELETE FROM users WHERE users = ?', [JSON.stringify(this.users)], (err) => { if (err) throw err });
    }
    this.updateUsersInDb = function() {
        db.run('UPDATE users SET users = ? WHERE users = ?', [JSON.stringify(this.users), JSON.stringify(this.users)], (err) => { if (err) throw err });
    }
    this.getUsersFromDb = function() {
        db.get('SELECT * FROM users WHERE users = ?', [JSON.stringify(this.users)], (err, row) => {
            if (err) throw err;
            this.users = JSON.parse(row.users);
        });
    }
}

tableCreationPromise
    .then(() => {
        let food1 = new Food('melon3', 999).addFoodToDb();
        
    })
    .then(() => {
        let food1 = new Food('apple', 5).addFoodToDb();
        
    })
    .catch(err => console.error("Error:", err));

/*
var surprisebag1 = new surpriseBag();
surprisebag1.add(food1);
surprisebag1.add(food2);
surprisebag1.addBagToDb();

var regularBag1 = new regularBag();
regularBag1.add(food3);
regularBag1.add(food4);
regularBag1.addBagToDb();
*/