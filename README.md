# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (similar to bit.ly).

## Final Product
Urls page - shows user's created urls
!["screenshot of urls page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/urls-page.png?raw=true)

Registration page - lets user register
!["screenshot of registration page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/registration-page.png?raw=true)

Short url page - enables user to change the original url
!["screenshot of short url page"](https://github.com/maggieholbling/tinyapp/blob/master/docs/show-url-page.png?raw=true)

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