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
        const queryText = 'INSERT INTO User.accounts (userID, username, salt, hashed_password) VALUES ($1, $2, $3, $4)';
        const values = [userID, username, salt, hashedPassword];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating a user:', error);
        return { success: false, message: 'Failed to create user' };
    }

  }

  // Method to check uniqueness of username

  // Method to edit user own profile
  async editProfile(userID, content) {
    /*
      * Edit user profile in the database
      * @param {string} userID - The ID of the user whose profile is to be edited, assume the userID is the own user
      * @param {list} content - The new content to be updated, "username", "description", "privacy"
    */
    try {
        // Edit user profile in the database
        const client = await pool.connect();
        const queryText = `UPDATE User.accounts SET ${editType} = $1 WHERE userID = $2`;
        const values = [content, userID];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'User profile edited successfully' };
    } catch (error) {
        console.error('Error editing user profile:', error);
        return { success: false, message: 'Failed to edit user profile' };
    }
  }


  // Method to view profile
  async viewProfile(userID) {
    /*
      * Retrieve user profile from the database
      * @param {string} userID - The ID of the user whose profile is to be retrieved
    */
    try {
        // Retrieve user information from the database
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.accounts WHERE userID = $1';
        const values = [userID];
        const result = await client.query(queryText, values);

        // Check if user exists
        if (result.rows.length === 0) {
            return { success: false, message: 'User not found' };
        }

        // Check if user is public
        const user = result.rows[0];
        if (user.is_private === false) {
            return { success: true, message: 'User profile retrieved successfully', user };
        }

        // Check if the user is following the target user or the target user is themselves
        const isFollowing = await this.isFollowing(userID, targetUserID);
        client.release();
        if (isFollowing || userID === targetUserID) {
            return { success: true, message: 'User profile retrieved successfully', user };
        } else {
            return { success: false, message: 'User is private' };
        }
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return { success: false, message: 'Failed to retrieve user profile' };
    }
  }

  // Method to create a new post
  async createPost(userID, postContent, attachments) {
    /*
      * Create a new post in the database
      * @param {string} userID - The ID of the user creating the post
      * @param {string} postContent - The content of the post
      * @param {string[]} attachments - An array of attachment URLs
    */
    try {
        // Insert post information into the database
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.posts (userID, postContent, attachments) VALUES ($1, $2, $3)';
        const values = [userID, postContent, attachments];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Post created successfully' };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'Failed to create post' };
    }
  }

  // Method to edit own post
  async editPost(userID, postID, editContent) {
    /*
      * Edit own post in the database
      * @param {string} userID - The ID of the user editing the post
      * @param {string} postID - The ID of the post to be edited, assume the post belongs to the user and the post exists
      * @param {string} editContent - The new content to be updated
    */
    try {
        // Edit post in the database
        const client = await pool.connect();
        const queryText = 'UPDATE User.posts SET postContent = $1 WHERE postID = $2 AND userID = $3';
        const values = [editContent, postID, userID];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Post edited successfully' };
    } catch (error) {
        console.error('Error editing post:', error);
        return { success: false, message: 'Failed to edit post' };
    }
  }

  // Method to delete own post
  async deletePost(userId, postId) {
    /*
      * Delete a post from the database
      * @param {string} postID - The ID of the post to be deleted, assume the post belongs to the user and the post exists
      * @param {string} userId - The ID of the user deleting the post
    */
    try {
        // Delete post from the database
        const client = await pool.connect();
        const queryText = 'DELETE FROM User.posts WHERE postID = $1 AND userId = $2';
        const values = [postId, userId];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'Failed to delete post' };
    }
  }

  // Method to like a post
  async likePost(userID, postID, LikePostID) {
    /*
      * Like a post in the database
      * @param {string} userID - The ID of the user liking the post
      * @param {string} postID - The ID of the post to be liked
      * @param {string} LikePostID - a list of postID that the user has liked
    */
    try {
      // Check if the user has already liked the post
      if (LikePostID.includes(postID)) {
          return { success: false, message: 'User has already liked the post' };
      }

      // If not, like the post, and update the like count in the database
      const client = await pool.connect();
      const queryText = 'UPDATE Post.posts SET likes = likes + 1 WHERE postID = $1';
      const values = [postID];
      await client.query(queryText, values);
      client.release();

      // Add the postID to the list of liked posts
      LikePostID.push(postID);
      return { success: true, message: 'Post liked successfully' };

    } catch (error) {
        console.error('Error liking post:', error);
        return { success: false, message: 'Failed to like post' };
    }
  }

  // Method to unlike a post
  async unlikePost(userID, postID, LikePostID) {
    /*
      * Unlike a post in the database
      * @param {string} userID - The ID of the user unliking the post
      * @param {string} postID - The ID of the post to be unliked
      * @param {string} LikePostID - a list of postID that the user has liked
    */

    try {
      // Check if the user has already liked the post
      if (!LikePostID.includes(postID)) {
          return { success: false, message: 'User has not liked the post' };
      }

      // If not, unlike the post, and update the like count in the database
      const client = await pool.connect();
      const queryText = 'UPDATE Post.posts SET likes = likes - 1 WHERE postID = $1';
      const values = [postID];
      await client.query(queryText, values);
      client.release();

      // Remove the postID from the list of liked posts
      LikePostID.splice(LikePostID.indexOf(postID), 1);
      return { success: true, message: 'Post unliked successfully' };

    } catch (error) {
        console.error('Error unliking post:', error);
        return { success: false, message: 'Failed to unlike post' };
    }
  }

  // Method to repost a post
  async repostPost() {}
  
  // Method to comment on a post
  async commentPost(userID, postID, comment) {
    /*
      * Comment on a post in the database
      * @param {string} userID - The ID of the user commenting on the post
      * @param {string} postID - The ID of the post to be commented on
      * @param {string} comment - The content of the comment
    */
    try {
        // Insert comment into the database
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.comments (userID, postID, comment) VALUES ($1, $2, $3)';
        const values = [userID, postID, comment];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Commented on post successfully' };
    } catch (error) {
        console.error('Error commenting on post:', error);
        return { success: false, message: 'Failed to comment on post' };
    }
  }

  // Method to search other users
  async searchUser(keyword) {
    /*
      Search for other users by keyword in the database
      @param {string} keyword - The keyword to search for
    */
    try {
  
        const client = await pool.connect();

        // Search for username by keyword in the database
        const queryText = 'SELECT * FROM User.accounts WHERE username LIKE $1';
        const values = [`%${keyword}%`];
        const result = await client.query(queryText, values);

        result.rows = result.rows.concat(result2.rows);

        return { success: true, message: 'Users retrieved successfully', users: result.rows };
    } catch (error) {
        console.error('Error searching for users:', error);
        return { success: false, message: 'Failed to search for users' };
    }
  }

  // Method to follow other users
  async followUser(userID, targetUserID) {
    /*
      * Follow another user in the database
      * @param {string} userID - The ID of the own user
      * @param {string} targetUserID - The ID of the user want to follow
    */
    try {
        // Check if the user is already following the target user
        if (await this.isFollowing(userID, targetUserID)) {
            return { success: false, message: 'User is already following the target user' };
        }

        // Check if the target user is public
        if (!await this.isPrivate(targetUserID)) {
            // If public, follow the target user
            const client = await pool.connect();
            const queryText = 'INSERT INTO User.followers (userID, followingID) VALUES ($1, $2)';
            const values = [userID, targetUserID];
            await client.query(queryText, values);
            client.release();
            return { success: true, message: 'Followed user successfully' };
        }

        // If not, send follow request to the target user
        const client = await pool.connect();
        // Append userID to target user's list of pending followers

        // Waiting for update
        /*







        */

        client.release();

        return { success: true, message: 'Follow request sent successfully' };
    } catch (error) {
        console.error('Error following user:', error);
        return { success: false, message: 'Failed to follow user' };
    }
  }

  async acceptFollowRequest(awaitAcceptFollowerID) {
    /*
      * Accept follow request in the database
      * @param {string} awaitAcceptFollowerID - The ID of the user who want to follow the own user
    */

    try {
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.followers (userID, followingID) VALUES ($1, $2)';
        const values = [awaitAcceptFollowerID, userID];
        await client.query(queryText, values);
        client.release();

        // Remove awaitAcceptFollowerID from the list of pending followers
        pendingFollowers.splice(pendingFollowers.indexOf(awaitAcceptFollowerID), 1);

        return { success: true, message: 'User followed successfully' };
    } catch (error) {
        console.error('Error following user:', error);
        return { success: false, message: 'Failed to follow user' };
    }
  }

  // Method to unfollow other users
  async unfollowUser(targetUserID) {
    /*
      * Unfollow another user in the database
      * @param {string} targetUserID - The ID of the user to unfollow
    */
    try {
        // Check if the user is following the target user
        if (!await this.isFollowing(userID, targetUserID)) {
            return { success: false, message: 'User is not following the target user' };
        }

        // Unfollow the target user
        const client = await pool.connect();
        const queryText = 'DELETE FROM User.followers WHERE userID = $1 AND followingID = $2';
        const values = [userID, targetUserID];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Unfollowed user successfully' };
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return { success: false, message: 'Failed to unfollow user' };
    }
  }

  // Method to set privacy settings
  async setPrivacy(privacyControl) {
    /*
      * Set privacy settings in the database
      * @param {boolean} privacyControl - The privacy setting to be updated
    */
    try {
        // if privacyControl is true, set the user's account to private
        if (privacyControl) {
          const client = await pool.connect();
          const queryText = 'UPDATE User.accounts SET is_private = true WHERE userID = $1';
          const values = [userID];
          await client.query(queryText, values);
          client.release();
        }

        // if privacyControl is false, set the user's account to public
        if (!privacyControl) {
          const client = await pool.connect();
          const queryText = 'UPDATE User.accounts SET is_private = false WHERE userID = $1';
          const values = [userID];
          await client.query(queryText, values);
          client.release();
        }

        return { success: true, message: 'Privacy settings updated successfully' };
    } catch (error) {
        console.error('Error setting privacy settings:', error);
        return { success: false, message: 'Failed to set privacy settings' };
    }
  }

  // Method to get post
  async getPost(postID) {
    /*
      * Retrieve post information from the database
      * @param {string} postID - The ID of the post to be retrieved
    */
    try {
        // Retrieve post information from the database
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.posts WHERE postID = $1';
        const values = [postID];
        const result = await client.query(queryText, values);
        client.release();

        // Check if post exists
        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        console.error('Error retrieving post:', error);
        return null;
    }
  }

  // Method to check if the user following the target user
  async isFollowing(userID, targetUserID) {
    /*
      * Check if the user is following the target user
      * @param {string} userID - The ID of the user to check
      * @param {string} targetUserID - The ID of the user to check if the user is following
    */
    try {
        // Check if the user is following the target user
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.followers WHERE userID = $1 AND followingID = $2';
        const values = [userID, targetUserID];
        const result = await client.query(queryText, values);
        client.release();

        return result.rows.length > 0;
    } catch (error) {
        console.error('Error checking if user is following:', error);
        return false;
    }
  }

  // Method to check if the target user is private
  async isPrivate(targetUserID) {
    /*
      * Check if the target user is private
      * @param {string} targetUserID - The ID of the target user
    */
    
    try {
        // Check if the target user is private
        const client = await pool.connect();
        const queryText = 'SELECT is_private FROM User.accounts WHERE userID = $1';
        const values = [targetUserID];
        const result = await client.query(queryText, values);
        client.release();

        return result.rows[0].is_private;
    } catch (error) {
        console.error('Error checking if user is private:', error);
        return false;
    }
  } 
}

module.exports = UserHandler;