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

class PostHandler {
    constructor(postID, authorID, content, privacy, creationTime, likes, attachmentURL) {
      this.postID = postID;
      this.authorID = authorID;
      this.content = content;
      this.privacy = privacy;
      this.creationTime = creationTime;
      this.likes = likes;
      this.attachmentURL = attachmentURL;
    }
    
    // Method to get postID
    async getPostID() {
        return this.postID;
    }

    // Method to get authorID
    async getAuthorID() {
        return this.authorID;
    }

    // Method to get content
    async getContent() {
        return this.content;
    }

    // Method to get creationTime
    async getCreationDate() {
        return this.creationTime;
    }

    // Method to get likes
    async getLikes() {
        return this.likes;
    }

    // Method to get posts according to userID
    async getPostsByUserID(userID) {
        try {

            const client = await pool.connect();
            const query = 'SELECT * FROM posts WHERE authorID = $1';
            const values = [userID];
            const result = await client.query(query, values);
            client.release();

            return {
                success: true,
                message: 'Posts retrieved successfully',
                posts: result.rows[0]
            }

        } catch (error) {
            console.error('Error getting posts:', error);
        }
    }

}