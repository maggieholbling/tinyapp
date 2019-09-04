/**
 * Generates a string of random alphanumeric characters
 * @param {number} charLength the number of characters in the resulting string
 */
const generateRandomString = function (charLength) {
  let result = "";
  const characters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  const upperNumbers = [];

  for(let i = 0; i < characters.length; i++) {
    
    const upperChar = characters[i].toUpperCase();
    upperNumbers.push(upperChar);
    
    if (i < 10) {
      upperNumbers.push(i);
    }
  }
  
  var newArray = upperNumbers.concat(characters);

  for(let k = 0; k < charLength; k++) {
    result += newArray[Math.floor(Math.random() * newArray.length)];
  }

  return result;
};

module.exports = generateRandomString;