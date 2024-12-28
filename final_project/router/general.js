const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

public_users.get('/', async function (req, res) {
  try {
    const allBooks = await axios.get('http://localhost:5000/books'); 
    return res.status(200).json(allBooks.data);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;

  try {
    const book = await axios.get(`http://localhost:5000/books/${isbn}`); 
    if (book.data) {
      return res.status(200).json(book.data);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;

  try {
    const allBooks = await axios.get('http://localhost:5000/books'); 
    const filteredBooks = Object.values(allBooks.data).filter(
      book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;

  try {
    const allBooks = await axios.get('http://localhost:5000/books'); 
    const filteredBooks = Object.values(allBooks.data).filter(
      book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});

public_users.get('/review/:isbn', async function (req, res) {
  const { isbn } = req.params;

  try {
    const book = await axios.get(`http://localhost:5000/books/${isbn}`); 
    if (book.data && book.data.reviews) {
      return res.status(200).json(book.data.reviews);
    } else {
      return res.status(404).json({ message: "Book not found or reviews not available" });
    }
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
});


module.exports.general = public_users;
