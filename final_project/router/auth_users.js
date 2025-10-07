const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Checks if user is valid
const isValid = (username) => {
    //Filter user array for any user with the same username
    let userWithSameName = users.filter((user) => {
        return user.username === username;
    });

    // Return true if any user with the same username is found, otherwise false
    if (userWithSameName.length > 0) {
        return true;
    } else {
        return false;
    }
}

// Checks if user exits and password matches
const authenticatedUser = (username, password)=>{
  // Filter user array for any user with the same username and password
  let validUser = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  //Return true if any user is found valid, otherwise
  if (validUser.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Login endpoint - /customer/login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password is missing
  if (!username || !password) {
    return res.status(401).json({message: "Username or password is missing"});
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      //Generate JWT access token
      let accessToken = jwt.sign(
          {data: password},
          "access",
          {expiresIn: 60* 60});

      //Store access token and username in session
      req.session.authorization = {
        accessToken, username
      }
      return res.status(200).json({message: "User successfully logged in"});
  } else {
      return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
