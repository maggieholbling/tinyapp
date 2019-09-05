const express = require("express");
var cookieParser = require('cookie-parser');
const generateRandomString = require("./generateRandomString");
const bcrypt = require('bcrypt');
const app = express();
const PORT = 8080;

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW333" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW333" }
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
  let result = {emailExists: false};
  Object.keys(object).forEach((key) => {
    if (object[key][userKey] === value) {
      result = {emailExists: true, user: object[key]};
    }
  })
  return result;
};

/**
 * Loops through an object and trims it down to just the nested objects, whose key (specified by param innerKey) value matches the given value.
 * @param {String} innerKey the user's (nested object's) key being tested for the given value
 * @param {Object} object the object to loop through
 * @param {*} value the value that's being looked for - must be primitive type
 */
const filterByInnerKey = (innerKey, object, value) => {
  let result = {};
  Object.keys(object).forEach((key) => {
    if (object[key][innerKey] === value) {
      result[key] = object[key];
    }
  })
  return result;
};

//registration page
app.get('/register', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("registration", templateVars);
});

//handling registration
app.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please fill out your email and password.");
  
  } else if (userKeyLookup("email", users, req.body.email).emailExists) {
      res.status(400);
      res.send("Email already in use.");
  
  } else {
    let userRandomID;
    do { userRandomID = generateRandomString(9);
    } while (users[userRandomID]);

    users[userRandomID] = {
      id: userRandomID, 
      email: req.body.email,
      password: hashedPassword
    };

    res.cookie("user_id", userRandomID);
    res.redirect("/urls");
  }
});

//login page
app.get('/login', (req, res) => {
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("login", templateVars);
});

//handling login
app.post('/login', (req, res) => {
  const emailLookupResult = userKeyLookup("email", users, req.body.email);
  if (req.body.email === "" || req.body.password === "") {
    res.status(400);
    res.send("Please fill out your email and password.");
  
  } else if (!emailLookupResult.emailExists) {
    res.status(400);
    res.send("No user found for email address: " + req.body.email);
  
  } else if(!bcrypt.compareSync(req.body.password, emailLookupResult.user.password)) {
    res.status(400);
    res.send("Incorrect password");
  
  } else {
  res.cookie("user_id", emailLookupResult.user.id);

  res.redirect("/urls");
  }
});

//logout
app.post('/logout', (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//page shows index of urls
app.get("/urls", (req, res) => {
  if (!req.cookies["user_id"]) return res.redirect("/login");
  const userURLDatabase = filterByInnerKey("userID", urlDatabase, req.cookies["user_id"]);
  let templateVars = {
    user: users[req.cookies["user_id"]],
    urls: userURLDatabase
  };                   
  res.render("urls_index", templateVars);
});

//generating a short url
app.post("/urls", (req, res) => {
  let shortURL;
  do { shortURL = generateRandomString(6);
  } while (urlDatabase[shortURL]);
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies["user_id"]
    };
    res.redirect("/urls/" + shortURL);
});

//new url page
app.get("/urls/new", (req, res) => {
  if (!req.cookies["user_id"]) return res.redirect("/login");
  let templateVars = { user: users[req.cookies["user_id"]] };
  res.render("urls_new", templateVars);
});

//page shows short url
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { 
    user: users[req.cookies["user_id"]],
    longURL: urlDatabase[req.params.shortURL].longURL,
    shortURL: req.params.shortURL };
  res.render("urls_show", templateVars);
});

//updating links
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID !== req.cookies["user_id"]) {
    res.redirect("/urls");
  } else {
  urlDatabase[req.params.shortURL].longURL = req.body.newLongURL;
  res.redirect("/urls/" + shortURL);
  }
})


//deleting a url
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  if (urlDatabase[shortURL].userID === req.cookies["user_id"]) {
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls/");
});

//redirecting back to original url
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/*", (req, res) => {
  res.redirect("/urls/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});