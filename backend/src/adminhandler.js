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

class AdminHandler extends AccountHandler {
  constructor() {
    super();
    // Additional initialization specific to admin handler
  }

  // Method to get all users
  async getAllUsers() {
    try {
      const client = await pool.connect();
      const queryText = 'SELECT * FROM users';
      const result = await client.query(queryText);
      client.release();
      return result.rows;
    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  // Method to get a user
  async getUser(userID) {
    try {
      const client = await pool.connect();
      const queryText = 'SELECT * FROM users WHERE user_id = $1';
      const values = [userID];
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Method to delete a user
  async deleteUser(userID) {
    try {
      const client = await pool.connect();
      const queryText = 'DELETE FROM users WHERE user_id = $1';
      const values = [userID];
      await client.query(queryText, values);
      client.release();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Method to search for a user
  async getUser(userID) {
    try {
      const client = await pool.connect();
      const queryText = 'SELECT * FROM users WHERE user_id = $1';
      const values = [userID];
      const result = await client.query(queryText, values);
      client.release();
      return result.rows[0];
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  // Method to delete a post
  async deletePost(postID) {
    try {
      const client = await pool.connect();
      const queryText = 'DELETE FROM posts WHERE post_id = $1';
      const values = [postID];
      await client.query(queryText, values);
      client.release();
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  // Method to delete a comment
  async deleteComment(commentID) {
    try {
      const client = await pool.connect();
      const queryText = 'DELETE FROM comments WHERE comment_id = $1';
      const values = [commentID];
      await client.query(queryText, values);
      client.release();
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }

}

module.exports = AdminHandler;