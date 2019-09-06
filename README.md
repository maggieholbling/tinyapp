# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs, see link usage statistics (hit counter, hit counter for unique users and timestamps for each visit on a url), similar to bit.ly.

## Final Product
Urls page - shows user's created urls and tracks the number of all hits and number of hits by unique users
!["screenshot of urls page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/url-page.png)

Registration page - lets user register
!["screenshot of registration page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/registration-page.png?raw=true)

Short url page - enables user to change the original url, shows visits by all users (even if they aren't logged in)
!["screenshot of short url page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/edit-url-with-tracking.png)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Helper Functions
(found in /helpers.js)
### generateRandomString
 - Generates a string of random alphanumeric characters
 - @param `charLength` is the number of characters in the resulting string

 ### findByInnerKey

 - Loops through an object and returns the first nested object, whose key (specified by `innerKey`) value matches the given `value`.
 - @param `innerKey` the nested object's key, whose value is being tested
 - @param `object` is the object to loop through
 - @param `value` is the value that's being looked for - must be primitive type

 ### filterByInnerKey

 - Loops through an object and trims it down to just the nested objects, whose key (specified by `innerKey`) value matches the given `value`.
 - @param `innerKey` is the nested object's key, whose value is being tested
 - @param `object` is the object to loop through
 - @param `value` is the value that's being looked for - must be primitive type