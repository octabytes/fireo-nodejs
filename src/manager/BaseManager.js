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
    if (this.__meta.id && this.__meta.id.getValue) {
      return firestore
        .collection(this.__meta.collectionName)
        .doc(this.__meta.id.getValue);
    }

    return firestore.collection(this.__meta.collectionName).doc();
  }

  /**
   * Generate firestore doc ref from id or key
   * @param {string} by - Document id
   * @param {string} key - Document key
   */
  __createDocRef(by = { id, key }) {
    if (by.id) {
      return firestore.collection(this.__meta.collectionName).doc(by.id);
    } else {
      return firestore.doc(by.key);
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
