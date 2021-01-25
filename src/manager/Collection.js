const { DocumentNotFound } = require("../../errors");
const BaseManager = require("./BaseManager");
const Query = require("./Query");

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
   * @param {Object} by - Document id or key
   * @param {string} by.id - Document id
   * @param {string} by.key - Document key
   */
  async get(by = { id, key }) {
    const docRef = this.__createDocRef(by);

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
      key: this.__extractKeyFromDocRef(docRef),
    });

    return this.__modelObj;
  }

  /**
   * Delete firestore document
   * @param {Object} by - Document id or key
   * @param {string} by.id - Document id
   * @param {string} by.key - Document key
   */
  async delete(by = { id, key }) {
    const docRef = this.__createDocRef(by);
    await docRef.delete();
  }

  /**
   * Filter firestore document
   * @param {string} field - Name of the field
   * @param {string} operator - Firestore operator
   * @param {string} value - value to search
   */
  where(field, operator, value) {
    const query = new Query(this);
    return query.where(field, operator, value);
  }

  /**
   * Fetch collection docs
   * @param {number} limit - Limit the firestore documents
   */
  async fetch(limit) {
    const query = new Query(this);
    return await query.fetch(limit);
  }

  /**
   * Limit collection docs
   * @param {number} limit - Limit the firestore documents
   */
  limit(number) {
    const query = new Query(this);
    return query.limit(number);
  }
}

module.exports = Collection;
