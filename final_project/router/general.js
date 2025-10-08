const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  // Return error if username or password is missing
  return res.status(401).json({message: "Unable to register user."});
});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    // Simulate fetching data asynchronously using async/await.
    const getBooks = async () => {
      return books;
    };

    const allBooks = await getBooks();
    res.send(JSON.stringify({ books: allBooks }, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Simulate asynchronous call for fetching book by ISBN
    const getBookByIsbn = async (isbn) => {
      return books[isbn];
    };

    const book = await getBookByIsbn(isbn);

    if (book) {
      res.send(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try{
      const author = req.params.author;

      // Simulate asynchronous call for fetching book object by keys
      const getBookKeysByAuthor = async (books) => {
        return Object.keys(books)
      }

      const bookKeys = await getBookKeysByAuthor(author);

      // Iterate through the books and filter by author
      const filtered_books = bookKeys.map(key => {
        return {isbn: key, ...books[key]}
      })
        .filter(book => book.author === author);

      if (filtered_books.length > 0) {
        res.send(filtered_books);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
  } catch (error) {
    res.status(500).json({message: "Error fetching book"});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  try {
    const title = req.params.title;

    // Simulate asynchronous call for fetching book object by keys
    const getBookKeysByTitle = async (books) => {
      return Object.keys(books)
    }

    const bookKeys = await getBookKeysByTitle(title);

    // Iterate through the books and filter by title
    const filtered_books = bookKeys.map(key => {
      return {isbn: key, ...books[key]}
    })
        .filter(book => book.title === title);

    // Return filtered book or indicate not found
    if (filtered_books.length > 0) {
      res.send(filtered_books);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  // Check if the book exists
  const book = books[isbn]

  if (book) {
    //Send only the reviews object
    res.send(book.reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;