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
    constructor(userID, username, salt, hashedPassword, userType) {
      // Initialize any necessary properties or connections
      this.userID = userID;
      this.username = username;
      this.salt = salt;
      this.hashedPassword = hashedPassword;
      this.userType = userType;
    }

    async authenticateAccount(username, account_input_password) {
      /*
        * Authenticate the account with the given username and password
        * Return an object with the following properties:
        * - success: true if the authentication is successful, false otherwise
        * - message: a message indicating the result of the authentication
        * - userType: 'user' if the account is a user, 'admin' if the account is an admin, 'none' if the account does not exist
      */
      try {
          const client = await pool.connect();
  
          // Check if the username exists in the users table
          const userQueryText = 'SELECT * FROM users WHERE username = $1';
          const userValues = [username];
          const userResult = await client.query(userQueryText, userValues);
  
          // Check if the username exists in the admins table if not found in users table
          let account = userResult.rows[0];
          this.userType = 'user';
          if (userResult.rows.length === 0) {
              this.userType = 'none'
              const adminQueryText = 'SELECT * FROM admins WHERE username = $1';
              const adminValues = [username];
              const adminResult = await client.query(adminQueryText, adminValues);
              if (adminResult.rows.length > 0) {
                  account = adminResult.rows[0];
                  this.userType = 'admin';
              }
          }
  
          client.release();
  
          // If account not found, return failure message
          if (account.length === 0) {
              return { success: false, message: 'Account not found' };
          }
  
          // Check if the password is correct
          const account_input_hashedPassword = utils.hashPassword(account_input_password, account.salt);
          if (account_input_hashedPassword === account.password) {
              // Return authentication successful message along with account type
              return { success: true, message: 'Authentication successful', userType: this.userType };
          } else {
              return { success: false, message: 'Incorrect password' };
          }
      } catch (error) {
          console.error('Error authenticating account:', error);
          return { success: false, message: 'Failed to authenticate account' };
      }
    }
  

    // Method to log in
    async logIn(username, account_input_password) {
      const authenticationResult = await this.authenticateAccount(username, account_input_password);
      if (authenticationResult.success) {
          // Set the session to indicate that the user is logged in
          return { success: true, message: 'Logged in successfully' };
      } else {
          return { success: false, message: 'Failed to log in' };
      }
    }

    // Method to log out
    async logOut() {
      // Clear the session to indicate that the user is logged out
      return { success: true, message: 'Logged out successfully' };
    }

  }
  
  module.exports = AccountHandler;
  