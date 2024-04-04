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

class CommentHandler {
    constructor(commentID, content, authorID, commentDate, likes) {
        this.commentID = commentID;
        this.content = content;
        this.authorID = authorID;
        this.commentDate = commentDate;
        this.likes = likes;
    }

    // Method to get commentID
    async getCommentID() {
        return this.commentID;
    }

    // Method to get content
    async getContent() {
        return this.content;
    }

    // Method to get authorID
    async getAuthorID() {
        return this.authorID;
    }

    // Method to get commentDate
    async getCommentDate() {
        return this.commentDate;
    }

    // Method to get likes
    async getLikes() {
        return this.likes;
    }

    // Method to like a comment
    async likeComment() {
        const query = `UPDATE comment SET likes = likes + 1 WHERE commentID = ${this.commentID}`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    // Method to unlike a comment
    async unlikeComment() {
        const query = `UPDATE comment SET likes = likes - 1 WHERE commentID = ${this.commentID}`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    // Method to leave a comment
    async leaveComment() {
        const query = `INSERT INTO comment (postID, content, authorID) VALUES (${this.postID}, '${this.content}', ${this.authorID})`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

    // Method to edit a comment
    async editComment() {
        const query = `UPDATE comment SET content = '${this.content}' WHERE commentID = ${this.commentID}`;
        try {
            await pool.query(query);
        } catch (error) {
            console.log(error);
        }
    }

}