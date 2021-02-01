const { GeoPoint, FieldValue } = require("@google-cloud/firestore");
const firestore = require("./Firestore");
const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");
const BaseField = require("./src/fields/BaseField");

class Fireo {
  static async runTransaction(callback) {
    return await firestore.conn.runTransaction(async (t) => callback(t));
  }

  static batch() {
    return firestore.conn.batch();
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

  /**
   * Get firestore connection
   */
  static get connection() {
    return firestore;
  }
}

module.exports = {
  Fireo,
  Model,
  Field,
  BaseField,
};
