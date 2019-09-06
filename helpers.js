/**
 * Generates a string of random alphanumeric characters
 * @param {number} charLength the number of characters in the resulting string
 * @returns a string of random alphanumeric characters
 */
const generateRandomString = function(charLength) {
  let result = "";
  const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const upperAndNumbers = [];

  for (let i = 0; i < characters.length; i++) {
    const upperChar = characters[i].toUpperCase();
    upperAndNumbers.push(upperChar);
    if (i < 10) {
      upperAndNumbers.push(i);
    }
  }
  
  const newArray = upperAndNumbers.concat(characters);
  for (let k = 0; k < charLength; k++) {
    result += newArray[Math.floor(Math.random() * newArray.length)];
  }

  return result;
};

/**
 * Loops through an object and returns the first nested object, whose key (specified by param innerKey) value matches the given value.
 * @param {String} innerKey the nested object's key being tested for the given value
 * @param {Object} object the object to loop through
 * @param {*} value the value that's being looked for - must be primitive type
 * @returns the first nested object, whose key (specified) value matches the given value
 */
const findByInnerKey = (innerKey, object, value) => {
  let result;
  Object.keys(object).forEach((key) => {
    if (!result && object[key][innerKey] === value) {
      result = object[key];
    }
  });
  return result;
};

/**
 * Loops through an object and trims it down to just the nested objects, whose key (specified by param innerKey) value matches the given value.
 * @param {String} innerKey the nested object's key being tested for the given value
 * @param {Object} object the object to loop through
 * @param {*} value the value that's being looked for - must be primitive type
 * @returns an object of all nested objects, whose key (specified) value matches the given value
 */
const filterByInnerKey = (innerKey, object, value) => {
  let result = {};
  Object.keys(object).forEach((key) => {
    if (object[key][innerKey] === value) {
      result[key] = object[key];
    }
  });
  return result;
};

module.exports = { generateRandomString, findByInnerKey, filterByInnerKey };