/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

const pool = require('./database');

class AccountHandler {
    constructor() {
      // Initialize any necessary properties or connections
    }
  
    // Common methods for handling accounts can be defined here
  
    createUser(userID, username, salt, hashedPassword) {
      // Logic for creating a new user account
    }
  
    createAdmin(userID, username, salt, hashedPassword) {
      // Logic for creating a new admin account
    }
  
    // Other methods for account management can be added here
  }
  
  module.exports = AccountHandler;
  