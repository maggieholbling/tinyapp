const express = require("express");
var cookieParser = require('cookie-parser');
const generateRandomString = require("./generateRandomString");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Loops through an object and tests the element's (nested object's) - key value against the given value.
 * If the value is found, it returns an object with emailExists: true and the user (nested) object it tested against.
 * If not found, it returns an object with emailExists: false
 * @param {String} userKey the user's (nested object's) key being tested for the given value
 * @param {Object} object the object to loop through
 * @param {*} value the value that's being looked for - must be primitive type
 */
const userKeyLookup = (userKey, object, value) => {
  Object.keys(object).forEach((key) => {
    if (object[key][userKey] === value) {
      return {emailExists: true, user: object[key]};
    }
  })
  return {emailExists: false};
};

//registration page
app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("registration", templateVars);
});

//handling registration
app.post('/register', (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please fill out your email and password.");
  
  } else if (userKeyLookup("email", users, req.body.email).emailExists) {
      res.status(400);
      res.send("Email already in use.");
  
  } else {
    
    let userRandomID = generateRandomString(9);
    users[userRandomID] = {
      id: userRandomID, 
      email: req.body.email,
      password: req.body.password
    };

    res.cookie("user_id", userRandomID);
    res.redirect("/urls");
  }
});

//login
app.post('/login', (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

//page shows index of urls
app.get("/urls", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: urlDatabase
  };                   
  res.render("urls_index", templateVars);
});

//generating a short url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString(6);
  if (!urlDatabase[shortURL]) {
    urlDatabase[shortURL] = req.body.longURL;
  } else {
    res.send("Error, please refresh."); //possibility for recursion/ while loop to find a unique string
  }
  res.redirect("/urls/" + shortURL);
});

//new url page
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

//page shows short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]],
    longURL: urlDatabase[req.params.shortURL],
    shortURL: req.params.shortURL };
  res.render("urls_show", templateVars);
});

//updating links
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[req.params.shortURL] = req.body.newLongURL;
  res.redirect("/urls/" + shortURL);
})


//deleting a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});

//redirecting back to original url
app.get("/u/:shortURL", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL, templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("*", (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.redirect("/urls/", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});