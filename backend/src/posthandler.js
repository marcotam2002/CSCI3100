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
    constructor(postID, content, authorID, creationDate, likes) {
      this.postID = postID;
      this.content = content;
      this.authorID = authorID;
      this.creationDate = creationDate;
      this.likes = likes;
    }
    
    // Method to get postID
    async getPostID() {
        return this.postID;
    }

    // Method to get content
    async getContent() {
        return this.content;
    }

    // Method to get authorID
    async getAuthorID() {
        return this.authorID;
    }

    // Method to get creationDate
    async getCreationDate() {
        return this.creationDate;
    }

    // Method to get likes
    async getLikes() {
        return this.likes;
    }
    
    // Method to like a post
    async likePost(postID) {
        const query = `UPDATE post SET likes = likes + 1 WHERE postID = ${postID}`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    // Method to unlike a post
    async unlikePost(postID) {
        const query = `UPDATE post SET likes = likes - 1 WHERE postID = ${postID}`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    // Method to get recommendation

    // Method to create post
    async createPost() {
        const query = `INSERT INTO post (postID, content, authorID, creationDate, likes) VALUES \
        (${this.postID}, ${this.content}, ${this.authorID}, ${this.creationDate}, ${this.likes})`;
    }

    // Method to edit post
    async editPost(editContent) {
        
    }

    // Method to share post
    async sharePost() {

    }

}