const firestore = require("./Firestore");

class Fireo {
  static async runTransaction(callback) {
    return await firestore.runTransaction(async (t) => callback(t));
  }

  static batch() {
    return firestore.batch();
  }
}

module.exports = {
  Fireo,
};

// TODO
// other fields array, geo point etc
// Reference field
// array union, increment, server time
