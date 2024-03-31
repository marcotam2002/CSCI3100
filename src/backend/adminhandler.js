/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

const pool = require('./database');
const AccountHandler = require('./accounthandler');

class AdminHandler extends AccountHandler {
  constructor() {
    super();
    // Additional initialization specific to admin handler
  }

  // Methods specific to admin handling can be defined here
}

module.exports = AdminHandler;
