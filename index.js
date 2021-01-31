const { GeoPoint, FieldValue } = require("@google-cloud/firestore");
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

  /**
   * Add element in firestore list
   * @param {Any} element - element to add in list
   */
  static listUnion(element) {
    return FieldValue.arrayUnion(element);
  }

  /**
   * Remove element in firestore list
   * @param {Any} element - element to remove in list
   */
  static listRemove(element) {
    return FieldValue.arrayRemove(element);
  }

  /**
   * Increment number in firestore
   * @param {number} number increment number
   */
  static increment(number) {
    return FieldValue.increment(number);
  }
}

module.exports = {
  Fireo,
};

// TODO
// array union, increment
// allow to create firestore from service file and other things
