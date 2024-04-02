/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Copilot

const pool = require('./database');
const utils = require('./utils');

class AccountHandler {
    constructor(attributes) {
      // Initialize any necessary properties or connections
      this.userID = attributes.userID || null;
      this.username = attributes.username || null;
      this.salt = attributes.salt || null;
      this.hashedPassword = attributes.hashedPassword || null;
    }

    // Method to authenticate an account | log in
    async authenticateAccount(username, account_input_password) {
      try {
          // Retrieve account information from the database
          const client = await pool.connect();
          const queryText = 'SELECT * FROM accounts WHERE username = $1';
          const values = [username];
          const result = await client.query(queryText, values);
          client.release();

          // Check if the account exists
          if (result.rows.length === 0) {
              return { success: false, message: 'Account not found' };
          }

          // Check if the password is correct
          const account = result.rows[0];
          const account_input_hashedPassword = utils.hashPassword(account_input_password, account.salt);
          if (account_input_hashedPassword === account.hashed_password) {
              return { success: true, message: 'Authentication successful' };
          } else {
              return { success: false, message: 'Incorrect password' };
          }
      } catch (error) {
          console.error('Error authenticating account:', error);
          return { success: false, message: 'Failed to authenticate account' };
      }
    }

  }
  
  module.exports = AccountHandler;
  