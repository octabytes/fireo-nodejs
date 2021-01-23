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
   * Get key from doc ref
   * @param {DocumentReference} docRef - Firestore document reference
   */
  __extractKeyFromDocRef(docRef) {
    return docRef._path.segments.join("/");
  }
}

module.exports = BaseManager;
