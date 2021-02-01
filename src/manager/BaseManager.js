const firestore = require("../../Firestore");

class BaseManager {
  /**
   * @constructor
   * @param {MetaModel.__meta} meta - Meta data of model
   */
  constructor(meta) {
    this.__meta = meta;
  }

  /**
   * Get Firestore document reference
   */
  get __getDocRef() {
    let collectionPath = this.__meta.collectionName;

    if (this.__meta.parent) {
      collectionPath = this.__meta.parent;
      collectionPath += "/" + this.__meta.collectionName;
    }

    if (this.__meta.id && this.__meta.id.getValue) {
      return firestore.conn
        .collection(collectionPath)
        .doc(this.__meta.id.getValue);
    }

    return firestore.conn.collection(collectionPath).doc();
  }

  /**
   * Generate firestore doc ref from id or key
   * @param {Object} by - Document id or key
   * @param {string} by.id - Document id
   * @param {string} by.key - Document key
   */
  __createDocRef(by = { id, key }) {
    if (by.id) {
      return firestore.conn.collection(this.__meta.collectionName).doc(by.id);
    } else {
      return firestore.conn.doc(by.key);
    }
  }

  /**
   * Get key from doc ref
   * @param {DocumentReference} docRef - Firestore document reference
   */
  __extractKeyFromDocRef(docRef) {
    return docRef._path.segments.join("/");
  }
}

module.exports = BaseManager;
