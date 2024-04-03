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
const AccountHandler = require('./accounthandler');

class UserHandler extends AccountHandler {
  constructor() {
    super();
    
  }

  // Method to create a new user || register
  async createUser(username, password, secuirtyAnswers) {
    /*
      * Create a new user in the database
      * @param {string} username - The username of the new user
      * @param {string} password - The password of the new user
      * @param {string[]} secuirtyAnswers - The security answers of the new user for recover the account
    */
    try {
        // Check the uniqueness of the username
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.accounts WHERE username = $1';
        const values = [username];
        const result = await client.query(queryText, values);

        // if the username is already taken, return an error
        if (result.rows.length > 0) {
            client.release();
            return { success: false, message: 'Username already taken' };
        }

        // Generate salt and hashed password
        const salt = utils.generateSalt();
        const hashedPassword = utils.hashPassword(password, salt);

        // Insert new user into the database
        const queryText2 = 'INSERT INTO User.accounts (username, hashedPassword, salt, securityAnswers) VALUES ($1, $2, $3, $4)';
        const values2 = [username, hashedPassword, salt, securityAnswers];
        await client.query(queryText2, values2);
        client.release();
        return { success: true, message: 'User created successfully' };

    } catch (error) {
        console.error('Error creating a user:', error);
        return { success: false, message: 'Failed to create user' };
    }

  }

  // Method to edit user own profile
  async editProfile(content) {
    /*
      * Edit user profile in the database
      * @param {list} content - The new content to be updated, ["username", "description", "privacy"]
    */
    try {
        // Update user profile accordingly in the database
        const client = await pool.connect();

        username = content[0];
        description = content[1];
        privacy = content[2];

        // Update username
        const queryText = 'UPDATE User.accounts SET username = $1 WHERE userID = $2';
        const values = [username, this.userID];
        await client.query(queryText, values);

        // Update description
        const queryText2 = 'UPDATE User.accounts SET description = $1 WHERE userID = $2';
        const values2 = [description, this.userID];
        await client.query(queryText2, values2);

        // Update privacy
        const queryText3 = 'UPDATE User.accounts SET is_private = $1 WHERE userID = $2';
        const values3 = [privacy, this.userID];
        await client.query(queryText3, values3);

        client.release();

        return { success: true, message: 'User profile edited successfully' };
    } catch (error) {
        console.error('Error editing user profile:', error);
        return { success: false, message: 'Failed to edit user profile' };
    }
  }

  async viewOwnProfile() {
    /*
      * Retrieve user own profile from the database
    */
    try {
        // Retrieve user information from the database
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.accounts WHERE userID = $1';
        const values = [this.userID];
        const result = await client.query(queryText, values);
        client.release();
        return { success: true, message: 'User profile retrieved successfully', user: result.rows[0] };
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return { success: false, message: 'Failed to retrieve user profile' };
    }
  }

  // Method to view other users' profile
  async viewProfile(targetUserID) {
    /*
      * Retrieve other users' profile from the database
      * @param {string} userID - The ID of the user whose profile is to be retrieved
    */
    try {
        // Retrieve target user information from the database
        const client = await pool.connect();
        const queryText = 'SELECT * FROM User.accounts WHERE userID = $1';
        const values = [targetUserID];
        const result = await client.query(queryText, values);

        // Check if target user exists
        if (result.rows.length === 0) {
            return { success: false, message: 'Target user not found' };
        }

        // Check if target user is public
        const targetUser = result.rows[0];
        if (targetUser.is_private === false) {
            return { success: true, message: 'Target user profile retrieved successfully', targetUser };
        }

        // If target user is private, check if the user is following the target user
        const isFollowing = await this.isFollowing(userID, targetUserID);
        client.release();
        if (isFollowing) {
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
  async createPost(postContent, attachments) {
    /*
      * Create a new post in the database
      * @param {string} postContent - The content of the post
      * @param {string[]} attachments - An array of attachment URLs
    */
    try {
        // Insert post information into the database
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.posts (userID, postContent, attachments) VALUES ($1, $2, $3)';
        const values = [this.userID, postContent, attachments];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Post created successfully' };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, message: 'Failed to create post' };
    }
  }

  // Method to edit own post
  async editPost(postID, editedContent, removeRequest) {
    /*
      * Edit own post in the database
      * @param {string} postID - The ID of the post to be edited, assume the post belongs to the user and the post exists
      * @param {string} editedContent - The new content to be updated
      * @param {int[]} removeRequest - An array of attachment URLs index to be removed
    */
    try {
        // Edit post in the database
        const client = await pool.connect();
        const queryText = 'UPDATE User.posts SET postContent = $1 WHERE postID = $2 AND userID = $3';
        const values = [editContent, postID, userID];
        await client.query(queryText, values);

        // if removeRequest is not empty, remove the attachments and update the new attachments
        if (removeRequest.length > 0) {
            const queryText2 = 'SELECT attachments FROM User.posts WHERE postID = $1';
            const values2 = [postID];
            const result = await client.query(queryText2, values2);
            const attachments = result.rows[0].attachments;
            // remove the attachments with index in removeRequest
            for (let i = removeRequest.length - 1; i >= 0; i--) {
                attachments.splice(removeRequest[i], 1);
            }
            const queryText3 = 'UPDATE User.posts SET attachments = $1 WHERE postID = $2';
            const values3 = [attachments, postID];
            await client.query(queryText3, values3);
        }

        client.release();

        return { success: true, message: 'Post edited successfully' };
    } catch (error) {
        console.error('Error editing post:', error);
        return { success: false, message: 'Failed to edit post' };
    }
  }

  // Method to delete own post
  async deletePost(postId) {
    /*
      * Delete a post from the database
      * @param {string} postID - The ID of the post to be deleted, assume the post belongs to the user and the post exists
    */
    try {
        // Delete post from the database
        const client = await pool.connect();
        const queryText = 'DELETE FROM User.posts WHERE postID = $1 AND userId = $2';
        const values = [postId, this.userId];
        await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Post deleted successfully' };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, message: 'Failed to delete post' };
    }
  }

  // Method to like a post
  async likePost(postID) {
    /*
      * Like a post in the database
      * @param {string} postID - The ID of the post to be liked
    */
    try {
      // Check if the user has already liked the post
      if (this.LikePostID.includes(postID)) {
          return { success: false, message: 'User has already liked the post' };
      }

      // If not, like the post, and update the like count in the database
      const client = await pool.connect();
      const queryText = 'UPDATE Post.posts SET likes = likes + 1 WHERE postID = $1';
      const values = [postID];
      await client.query(queryText, values);
      client.release();

      // Add the postID to the list of liked posts
      this.LikePostID.push(postID);
      return { success: true, message: 'Post liked successfully' };

    } catch (error) {
        console.error('Error liking post:', error);
        return { success: false, message: 'Failed to like post' };
    }
  }

  // Method to unlike a post
  async unlikePost(postID) {
    /*
      * Unlike a post in the database
      * @param {string} postID - The ID of the post to be unliked
    */

    try {
      // Check if the user has already liked the post
      if (!this.LikePostID.includes(postID)) {
          return { success: false, message: 'User has not liked the post' };
      }

      // If not, unlike the post, and update the like count in the database
      const client = await pool.connect();
      const queryText = 'UPDATE Post.posts SET likes = likes - 1 WHERE postID = $1';
      const values = [postID];
      await client.query(queryText, values);
      client.release();

      // Remove the postID from the list of liked posts
      this.LikePostID.splice(this.LikePostID.indexOf(postID), 1);
      return { success: true, message: 'Post unliked successfully' };

    } catch (error) {
        console.error('Error unliking post:', error);
        return { success: false, message: 'Failed to unlike post' };
    }
  }

  // Method to repost a post
  async repostPost(postID) {
    /*
      * Repost a post in the database
      * @param {string} postID - The ID of the post to be reposted
    */
    try {
      
      // Retrive the userID of the post from post database
      const client = await pool.connect();
      const queryText = 'SELECT userID FROM User.posts WHERE postID = $1';
      const values = [postID];
      const result = await client.query(queryText, values);
      client.release();

      // Check if the user is private
      if (await this.isPrivate(result.rows[0].userID)) {
          return { success: false, message: 'User is private' };
      }

      // Repost the post
      const client2 = await pool.connect();
      const queryText2 = 'INSERT INTO User.posts (userID, postContent, attachments) VALUES ($1, $2, $3)';
      const values2 = [this.userID, `Reposted from ${result.rows[0].userID}`, result.rows[0].attachments];
      await client2.query(queryText2, values2);
      client2.release();
        
    } catch (error) {
        console.error('Error reposting post:', error);
        return { success: false, message: 'Failed to repost post' };
    }
  }
  
  // Method to comment on a post
  async commentPost(postID, comment) {
    /*
      * Comment on a post in the database
      * @param {string} postID - The ID of the post to be commented on
      * @param {string} comment - The content of the comment
    */
    try {
        // Insert comment into the database
        const client = await pool.connect();
        const queryText = 'INSERT INTO User.comments (userID, postID, comment) VALUES ($1, $2, $3)';
        const values = [this.userID, postID, comment];
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
        client.release();

        return { success: true, message: 'Users retrieved successfully', users: result.rows };
    } catch (error) {
        console.error('Error searching for users:', error);
        return { success: false, message: 'Failed to search for users' };
    }
  }

  // Method to follow other users
  async followUser(targetUserID) {
    /*
      * Follow another user in the database
      * @param {string} targetUserID - The ID of the user want to follow
    */
    try {
        // Check if the user is already following the target user
        if (await this.isFollowing(this.userID, targetUserID)) {
            return { success: false, message: 'User is already following the target user' };
        }

        // Check if the target user is public
        if (!await this.isPrivate(targetUserID)) {
            // If public, follow the target user
            const client = await pool.connect();
            const queryText = 'INSERT INTO User.followers (userID, followingID) VALUES ($1, $2)';
            const values = [this.userID, targetUserID];
            await client.query(queryText, values);
            client.release();
            return { success: true, message: 'Followed user successfully' };
        }

        // If not, send follow request to the target user
        const client = await pool.connect();
        // Append userID to target user's list of pending followers
        const queryText2 = 'INSERT INTO User.pending_followers (userID, pendingFollowerID) VALUES ($1, $2)';
        const values2 = [targetUserID, this.userID];
        await client.query(queryText2, values2);

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