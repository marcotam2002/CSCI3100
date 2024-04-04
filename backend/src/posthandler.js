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
const media = require('./mediahandler');

class PostHandler {
    constructor(postID, authorID, content, privacy, creationTime, likeIDs, attachmentURL) {
      this.postID = postID;
      this.authorID = authorID;
      this.content = content;
      this.privacy = privacy;
      this.creationTime = creationTime;
      this.likeIDs = likeIDs; // a list of userID who liked this post
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
        return this.likeIDs;
    }
    
    // Method to like a post
    async likePost(userID, postID) {
        /*
        * like a post in the database
        * param: userID - the ID of the user who likes the post
        * param: postID - the ID of the post to be liked
        */
        try {
            const client = await pool.connect();
            const query = 'UPDATE posts SET likeIDs = array_append(likeIDs, $1) WHERE postID = $2;'
            const values = [userID, postID];
            await client.query(query, values);
            client.release();
            return { success: true, message: 'Post liked'};
        } catch (error) {
            console.log(error);
        }
    }

    // Method to unlike a post
    async unlikePost(userID, postID) {
        /*
        * unlike a post in the database
        * param: postID - the ID of the post to be unliked
        */
        try {
            const client = await pool.connect();
            const query = 'UPDATE posts SET likeIDs = array_remove(likeIDs, $1) WHERE postID = $2';
            const values = [postID];
            await client.query(query, values);
            client.release();
            return { success: true, message: 'Post unliked'};
        } catch (error) {
            console.log(error);
        }
    }

    // Method to get recommendation

    // Method to create post
    async createPost() {
        try {
            const client = await pool.connect();
            const queryText = 'INSERT INTO posts (content, authorID, attachmentsURL) VALUES ($1, $2, $3) RETURNING postID';
            const values = [this.content, this.authorID, this.attachmentsURL];
            const result = await client.query(queryText, values);
    
            // Get the postID of the newly created post
            const postID = result.rows[0].postID;
            client.release();
            return { success: true, message: 'Post created successfully', postID };
        } catch (error) {
            console.error('Error creating post:', error);
            return { success: false, message: 'Failed to create post' };
        }
    }
    

    // Method to edit post
    async editPost(editedContent, removeRequest) {
        // Edit post in the database
        const client = await pool.connect();
        const queryText = 'UPDATE User.posts SET postContent = $1 WHERE postID = $2';
        const values = [editedContent, this.postID];
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
    }

    // Method to share post
    async sharePost() {
        const query = `INSERT INTO post (postID, content, authorID, creationDate, likes) VALUES \
        (${this.postID}, ${this.content}, ${this.authorID}, ${this.creationDate}, ${this.likes})`;
    }

}