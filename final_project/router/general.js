const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  //Write your code here
  try{
    return res.send(JSON.stringify(books, null, 4));
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  try{
    const author = req.params.author;
    const keys = Object.keys(books);
    let books_with_author = [];
    keys.forEach(key => {
        if(books[key]["author"] === author){
            books_with_author.push(books[key]);
        }
    });
    return res.send(books_with_author);
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  try{
    const title = req.params.title;
    const keys = Object.keys(books);
    let books_with_title = [];
    keys.forEach(key => {
        if(books[key]["title"] === title){
            books_with_title.push(books[key]);
        }
    });
    return res.send(books_with_title);
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    return res.send(books[isbn]["reviews"]);
  } catch(error) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports.general = public_users;
