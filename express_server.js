const express = require("express");
const cookieSession = require('cookie-session');
const { generateRandomString, findByInnerKey, filterByInnerKey } = require("./helpers");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;
const urlDatabase = {};
const users = {};

app.set("view engine", "ejs");

//MIDDLEWARE
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ["abc8dhdla"],
  expires: new Date("6666")
}));

//Setting a cookie for each user even when they are logged out
app.use((req, res, next) => {
  const randomID = generateRandomString(9);
  if (!req.session.global_user_id) {
  req.session.global_user_id = randomID;
  }
  next();
})

//POST METHODS
//handling registration
app.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please fill out your email and password.");
  
  } else if (findByInnerKey("email", users, req.body.email)) {
    res.status(400);
    res.send("Email already in use.");
  
  } else {
    let userRandomID;
    do {
      userRandomID = generateRandomString(9);
    } while (users[userRandomID]);

    users[userRandomID] = {
      id: userRandomID,
      email: req.body.email,
      password: hashedPassword
    };
    req.session.user_id = userRandomID;
    res.redirect("/urls");
  }
});

//handling login
app.post('/login', (req, res) => {
  const user = findByInnerKey("email", users, req.body.email);
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please fill out your email and password.");
  
  } else if (!user) {
    res.status(400);
    res.send("No user found for email address: " + req.body.email);
  
  } else if (!bcrypt.compareSync(req.body.password, user.password)) {
    res.status(400);
    res.send("Incorrect password");
  
  } else {
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

//logout
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//generating a short url
app.post("/urls", (req, res) => {
  if (!req.session.user_id) {
    res.status(401);
    return res.send("Please login");
  }
  if (!req.body.longURL) {
    res.status(400);
    return res.send("Please enter a valid URL");
  }
  let shortURL;
  do {
    shortURL = generateRandomString(6);
  } while (urlDatabase[shortURL]);
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.user_id,
    count: 0,
    cookieArray: []
  };
  res.redirect("/urls/" + shortURL);
});

//updating links
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    res.status(401);
    return res.send("Please login");
  }
  if (!req.body.newLongURL) return res.send("Please enter a valid URL");
  if (urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(401);
    return res.send("Cannot alter link: Incorrect user");
  }
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect("/urls");
});


//deleting a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!req.session.user_id) {
    res.status(401);
    return res.send("Please login");
  }
  if (urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(401);
    return res.send("Cannot delete link: Incorrect user");
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls/");
});


//GET METHODS
//registration page
app.get('/register', (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.render("registration", templateVars);
});

//login page
app.get('/login', (req, res) => {
  if (req.session.user_id) return res.redirect("/urls");
  let templateVars = { user: users[req.session.user_id] };
  res.render("login", templateVars);
});

//page shows index of urls
app.get("/urls", (req, res) => {
  if (!req.session.user_id) return res.redirect("/login");
  const userURLDatabase = filterByInnerKey("userID", urlDatabase, req.session.user_id);
  let templateVars = {
    user: users[req.session.user_id],
    urls: userURLDatabase
  };
  res.render("urls_index", templateVars);
});

//new url page
app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) return res.redirect("/login");
  let templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

//page shows short url
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (!urlDatabase[shortURL]) {
    res.status(400);
    return res.send("URL doesn't exist");
  }
  if (!req.session.user_id) {
    res.status(401);
    return res.send("Please login");
  }
  if (urlDatabase[shortURL].userID !== req.session.user_id) {
    res.status(401);
    return res.send("Cannot alter link: Incorrect user");
  }
  let templateVars = {
    user: users[req.session.user_id],
    longURL: urlDatabase[shortURL].longURL,
    shortURL };
  res.render("urls_show", templateVars);
});

//redirecting back to original url
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const globalCookie = req.session.global_user_id;
  if (!urlDatabase[shortURL]) {
    res.status(400);
    return res.send("URL doesn't exist");
  }
  const longURL = urlDatabase[shortURL].longURL;
  if (longURL.includes('https://')) {
    urlDatabase[shortURL].count++;
    return res.redirect(longURL);
  }
  if (!urlDatabase[shortURL].cookieArray.includes(globalCookie)) {
    urlDatabase[shortURL].cookieArray.push(globalCookie);
  }
  urlDatabase[shortURL].count++;
  res.redirect('https://' + longURL);
});

//getting a json file of the entire url database
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//redirecting to home page for any uncatched urls
app.get("/*", (req, res) => {
  res.redirect("/urls/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});