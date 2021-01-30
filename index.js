const firestore = require("./Firestore");

class Fireo {
  static async runTransaction(callback) {
    return await firestore.runTransaction(async (t) => callback(t));
  }
}

module.exports = {
  Fireo,
};

// TODO
// other fields array, geo point etc
// Reference field
// Transactions and batch
// array union, increment, server time
