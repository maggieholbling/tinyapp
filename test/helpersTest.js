const { assert } = require('chai');

const { findByInnerKey, filterByInnerKey } = require('../helpers.js');

const users = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  },
  "user3RandomID": {
    id: "user3RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findByInnerKey', function() {
  it('should return the first user with matching email', function() {
    const output = findByInnerKey("email", users, "user2@example.com")
    const expectedOutput = users.user2RandomID;
    assert.deepEqual(output, expectedOutput);
  });

  it('should return the first user with matching email', function() {
    const output = findByInnerKey("email", users, "user3@example.com")
    const expectedOutput = undefined;
    assert.deepEqual(output, expectedOutput);
  });

  it('should return the first user with matching id', function() {
    const output = findByInnerKey("id", users, "user2RandomID")
    const expectedOutput = users.user2RandomID;
    assert.deepEqual(output, expectedOutput);
  });
});

describe('filterByInnerKey', function() {
  it('should return an object of users with matching emails', function() {
    const output = filterByInnerKey("email", users, "user2@example.com")
    const expectedOutput = {
      "user2RandomID": users.user2RandomID,
      "user3RandomID": users.user3RandomID
    };
    assert.deepEqual(output, expectedOutput);
  });

  it('should return an empty object', function() {
    const output = filterByInnerKey("email", users, "user3@example.com")
    const expectedOutput = {};
    assert.deepEqual(output, expectedOutput);
  });

  it('should return an object the one user with matching id', function() {
    const output = filterByInnerKey("id", users, "user2RandomID")
    const expectedOutput = { "user2RandomID": users.user2RandomID };
    assert.deepEqual(output, expectedOutput);
  });
});