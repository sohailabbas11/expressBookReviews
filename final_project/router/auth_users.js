const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return username && username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: "1h" });
  return res.status(200).json({ message: "Login successful", token });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user?.username; 

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user?.username; 
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  } 
  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username]; 
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Review not found for the user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

