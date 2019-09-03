const express = require("express");
const generateRandomString = require("./generateRandomString");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (reqbody, res) => {
  res.send("Hello!");
});

//page shows index of urls
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
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
  res.render("urls_new");
});

//page shows short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
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
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});