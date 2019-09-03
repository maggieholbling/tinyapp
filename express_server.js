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

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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
    username: req.cookies["username"],
    urls: urlDatabase
  };                   
  res.render("urls_index", templateVars);
});

//generating a short url
app.post("/urls", (req, res) => {
  let shortURL = generateRandomString();
  if (!urlDatabase[shortURL]) {
    urlDatabase[shortURL] = req.body.longURL;
  } else {
    res.send("Error, please refresh."); //possibility for recursion/ while loop to find a unique string
  }
  res.redirect("/urls/" + shortURL);
});

//new url page
app.get("/urls/new", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

//page shows short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    username: req.cookies["username"],
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
  let templateVars = { username: req.cookies["username"] };
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL, templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("*", (req, res) => {
  let templateVars = { username: req.cookies["username"] };
  res.redirect("/urls/", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});