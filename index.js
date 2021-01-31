const { GeoPoint } = require("@google-cloud/firestore");
const firestore = require("./Firestore");

class Fireo {
  static async runTransaction(callback) {
    return await firestore.runTransaction(async (t) => callback(t));
  }

  static batch() {
    return firestore.batch();
  }

  /**
   * Create GeoPoint
   * @param {number} latitude The latitude as a number between -90 and 90
   * @param {number} longitude The longitude as a number between -180 and 180
   */
  static GeoPoint(latitude, longitude) {
    return new GeoPoint(latitude, longitude);
  }
}

module.exports = {
  Fireo,
};

// TODO
// other fields array, geo point etc
// Reference field
// array union, increment, server time
// allow to create firestore from service file and other things
// Custom Fields
