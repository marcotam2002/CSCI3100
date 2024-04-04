/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Copilot

const crypto = require('crypto');

const generateSalt = () => {
    return crypto.randomBytes(16).toString('hex');
}

const hashPassword = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('hex');
}

module.exports = {
    generateSalt,
    hashPassword
};
