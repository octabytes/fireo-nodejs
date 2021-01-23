const { DocumentNotFound } = require("../../errors");
const firestore = require("../../Firestore");
const BaseManager = require("./BaseManager");

/**
 * Operate firestore static operations i.e get, query etc
 * @extends BaseManager
 */
class Collection extends BaseManager {
  /**
   * Collection constructor
   * @override
   * @constructor
   * @param {Model} modelObj - Model object
   */
  constructor(modelObj) {
    super(modelObj.__meta);
    this.__modelObj = modelObj;
  }

  /**
   * Get firestore document
   * @param {string} id - Document id
   * @param {string} key - Document key
   */
  async get(by = { id, key }) {
    let docRef;

    if (by.id) {
      docRef = firestore.collection(this.__meta.collectionName).doc(by.id);
    } else {
      docRef = firestore.doc(by.key);
    }

    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      throw new DocumentNotFound(
        `Document not found in collection ${
          this.__meta.collectionName
        } against ${by.id || by.key}`
      );
    }

    this.__modelObj.__setFieldsValue({
      data: snapshot.data(),
      id: snapshot.id,
      key: by.key || this.__extractKeyFromDocRef(docRef),
    });

    return this.__modelObj;
  }
}

module.exports = Collection;
