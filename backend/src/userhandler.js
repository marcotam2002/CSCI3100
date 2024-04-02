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
const AccountHandler = require('./accounthandler');

class UserHandler extends AccountHandler {
  constructor() {
    super();
    
  }

  // Method to create a new user || signup
  async createUser(userID, username, password) {
    try {
        // Generate salt and hashed password
        const salt = utils.generateSalt();
        const hashedPassword = utils.hashPassword(password, salt);

        // Insert account information into the database
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.accounts (user_id, username, salt, hashed_password) VALUES ($1, $2, $3, $4)';
        const values = [userID, username, salt, hashedPassword];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating a user:', error);
        return { success: false, message: 'Failed to create user' };
    }

  }

  // Method to edit User profile
  async editProfile(userID, ) {}


  // Method to view own profile

  // Method to create a new post

  // Method to update a post

  // Method to delete a post

  // Method to like a post

  // Method to unlike a post

  // Method to repost a post

  // Method to comment on a post

  // Method to search other users

  // Method to view other user's profile

  // Method to follow other users

  // Method to unfollow other users

  // Method to set privacy settings
}

module.exports = UserHandler;