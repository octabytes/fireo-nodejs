const { Firestore: CloudFirestore } = require("@google-cloud/firestore");

/**
 * Create Firestore connection
 */
class Firestore {
  /**
   * @constructor
   */
  constructor() {
    this.connection;
  }

  /**
   * Get Firestore connection
   */
  get conn() {
    if (!this.connection) {
      this.connection = new CloudFirestore();
    }

    return this.connection;
  }
}

module.exports = new Firestore().conn;
