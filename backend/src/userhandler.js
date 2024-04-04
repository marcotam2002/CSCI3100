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
const { generateSalt, hashPassword } = require('./utils');
const AccountHandler = require('./accounthandler');
const PostHandler = require('./posthandler');
const CommentHandler = require('./commenthandler');
const MessageHandler = require('./messagehandler');

class UserHandler extends AccountHandler {
  constructor(userID, username, salt, hashedPassword, userType, pendingFollowers, securityAnswer, description, isPrivate, isActive) {
    super(userID, username, salt, hashedPassword, userType);
    this.pendingFollowers = pendingFollowers;
    this.securityAnswer = securityAnswer;
    this.description = description;
    this.isPrivate = isPrivate;
    this.isActive = isActive;
  }

  // Method to edit user own profile
  async editProfile(content) {
    /*
      * Edit user profile in the database
      * @param {list} content - The list of new content to be updated, ["username", "description", "privacy"]
    */
    try {
        // Update user profile accordingly in the database
        const client = await pool.connect();

        const username = content[0];
        const description = content[1];
        const privacy = content[2];

        // Check if the username is already taken
        const queryText = 'SELECT * FROM users WHERE username = $1';
        const values = [username];
        const result = await client.query(queryText, values);
    
        // if the username is already taken, return an error
        if (result.rows.length > 0) {
          client.release();
          return { success: false, message: 'Username already taken' };
        }

        // Update username
        const queryText1 = 'UPDATE users SET username = $1 WHERE userID = $2';
        const values1 = [username, this.userID];
        await client.query(queryText1, values1);

        // Update description
        const queryText2 = 'UPDATE users SET description = $1 WHERE userID = $2';
        const values2 = [description, this.userID];
        await client.query(queryText2, values2);

        // Update privacy
        const queryText3 = 'UPDATE users SET privacy = $1 WHERE userID = $2';
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
      * return {list[]} - The user profile ["username", "description", "privacy",  "post"]
    */
    try {
        const client = await pool.connect();

        const queryText = 'SELECT username, description, privacy FROM users WHERE userID = $1';
        const values = [this.userID];
        const result = await client.query(queryText, values);
        const userProfile = result.rows[0];

        const queryText2 = 'SELECT * FROM posts WHERE authorID = $1';
        const values2 = [this.userID];
        const result2 = await client.query(queryText2, values2);
        const posts = result2.rows;

        client.release();

        return { success: true, message: 'User profile retrieved successfully', userProfile: userProfile };

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
      * return {list[]} - The user profile ["username", "description", "privacy", "post"]
    */
    try {
        // Retrieve target user information from the database
        const client = await pool.connect();
        const queryText = 'SELECT * FROM users WHERE userID = $1';
        const values = [targetUserID];
        const result = await client.query(queryText, values);

        // Check if target user exists
        if (result.rows.length === 0) {
            return { success: false, message: 'Target user not found' };
        }

        // Check if target user is public
        const targetUser = result.rows[0];
        if (targetUser.privacy === 'public') {
            return { success: true, message: 'Target user profile retrieved successfully', targetUser };
        }

        // If target user is private, check if the user is following the target user
        const isFollowing = await this.isFollowing(this.userID, targetUserID);
        if (isFollowing) {
            
          // Retrieve username, description, and privacy from the database
          const queryText = 'SELECT username, description, privacy FROM users WHERE userID = $1';
          const values = [targetUserID];
          const result = await client.query(queryText, values);
          const userProfile = result.rows[0];
          const username = userProfile.username;
          const description = userProfile.description;
          const privacy = userProfile.privacy;

          // Retrieve posts from the database
          const queryText2 = 'SELECT * FROM posts WHERE authorID = $1';
          const values2 = [targetUserID];
          const result2 = await client.query(queryText2, values2);
          const posts = result2.rows;

          client.release();

          return {
            success: true,
            message: 'User profile retrieved successfully',
            user: [username, description, posts, privacy]
          };

        } else {
          client.release();
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
        const queryText = 'INSERT INTO posts (authorID, content, privacy) VALUES ($1, $2, $3)';
        const values = [this.userID, postContent, 'public'];
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
      * @param {string} postId - The ID of the post to be deleted
    */
    try {
        // Delete post from the database
        const client = await pool.connect();
        const queryText = 'DELETE FROM posts WHERE postID = $1';
        const values = [postId];
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
      const queryText = 'UPDATE posts SET likes = likes + 1 WHERE postID = $1';
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
      const queryText = 'UPDATE posts SET likes = likes - 1 WHERE postID = $1';
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
        const queryText = 'INSERT INTO comments (userID, postID, content) VALUES ($1, $2, $3)';
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
        const queryText = 'SELECT * FROM users WHERE username ILIKE $1';
        const values = [`%${keyword}%`];
        const result = await client.query(queryText, values);
        client.release();

        return { success: true, message: 'Users retrieved successfully', users: result.rows };
    } catch (error) {
        console.error('Error searching for users:', error);
        return { success: false, message: 'Failed to search for users' };
    }
  }

  // Method to get all following users
  async getFollowing() {
    /*
      * Retrieve all following users from the database
      * return {list[]} - The list of following users
    */
    try {
        // Retrieve following users from the database
        const client = await pool.connect();
        const queryText = 'SELECT followingID FROM relationships WHERE followerID = $1';
        const values = [this.userID];
        const result = await client.query(queryText, values);
        client.release();
        
        // Extract followingIDs from the result
        const followingIDs = result.rows.map(row => row.followingid);
        
        return { success: true, message: 'Following users retrieved successfully', following: followingIDs };

    } catch (error) {
        console.error('Error retrieving following users:', error);
        return { success: false, message: 'Failed to retrieve following users' };
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

        // Retrieve the privacy of the target user
        const client = await pool.connect();
        const queryText = 'SELECT privacy FROM users WHERE userID = $1';
        const values = [targetUserID];
        const result = await client.query(queryText, values);

        // Check if the target user is public
        if (result.rows[0].privacy === 'public') {
            // If the target user is public, append userID to target user's list of followers
            const queryText2 = 'INSERT INTO relationships (followerID, followingID) VALUES ($1, $2)';
            const values2 = [this.userID, targetUserID];
            await client.query(queryText2, values2);
            client.release();
            return { success: true, message: 'User followed successfully' };
        }

        // If not, send follow request to the target user
        // Append userID to target user's list of pending followers
        const queryText3 = 'INSERT INTO followRequests (followerID, followingID) VALUES ($1, $2)';
        const values3 = [this.userID, targetUserID];
        await client.query(queryText3, values3);

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
        const queryText = 'INSERT INTO relationships (followerID, followingID) VALUES ($1, $2)';
        const values = [awaitAcceptFollowerID, this.userID];
        await client.query(queryText, values);

        // Remove awaitAcceptFollowerID from the list of pending followers
        const deleteQuery = 'DELETE FROM followRequests WHERE followerID = $1 AND followingID = $2';
        const deleteValues = [awaitAcceptFollowerID, this.userID];
        await client.query(deleteQuery, deleteValues);

        client.release();

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
        if (!await this.isFollowing(this.userID, targetUserID)) {
            return { success: false, message: 'User is not following the target user' };
        }

        // Unfollow the target user
        const client = await pool.connect();
        const queryText = 'DELETE FROM relationships WHERE followerID = $1 AND followingID = $2';
        const values = [this.userID, targetUserID];
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
        const queryText = 'SELECT * FROM posts WHERE postID = $1';
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
        const queryText = 'SELECT * FROM relationships WHERE followerID = $1 AND followingID = $2';
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
        const queryText = 'SELECT privacy FROM users WHERE userID = $1';
        const values = [targetUserID];
        const result = await client.query(queryText, values);
        client.release();

        return result.rows.length > 0 && result.rows[0].privacy === 'private';
    } catch (error) {
        console.error('Error checking if user is private:', error);
        return false;
    }
  }
  
  // Method to check if security answers are correct
  async checkSecurityAnswer(securityAnswer) {
    /*
      * Check if the security answers are correct
      * @param {string} securityAnswer - The security answer of the account to check
    */
    try {
        // Check if the security answers are correct
        const client = await pool.connect();
        const queryText = 'SELECT secureqAns FROM users WHERE userID = $1';
        const values = [this.userID];
        const result = await client.query(queryText, values);
        client.release();

        // Retrieve the security answers from the result
        const retrievedSecurityAnswer = result.rows[0].secureqans;

        // Check if the provided security answers match the retrieved security answers
        return JSON.stringify(retrievedSecurityAnswer) === JSON.stringify(securityAnswer);
    } catch (error) {
        console.error('Error checking security answers:', error);
        return false;
    }
  }

  // Method to reset password
  async resetPassword(newPassword) {
    /*
      * Forget password and recover the account
      * @param {string} newPassword - The new password to be updated, assume we have checked the security answers
    */
    try {
        // Generate a new hashed password
        const salt = generateSalt();
        const newHashedPassword = hashPassword(newPassword, salt);

        const client = await pool.connect();

        // Update the password in the database
        const queryText2 = 'UPDATE users SET password = $1, salt = $2 WHERE userID = $3';
        const values2 = [newHashedPassword, salt, this.userID];
        await client.query(queryText2, values2);
        client.release();

        return { success: true, message: 'Password reset successfully', newPassword };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: 'Failed to reset password' };
    }
  }
}

module.exports = UserHandler;