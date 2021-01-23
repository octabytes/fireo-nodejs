const { DocumentNotFound } = require("../../errors");
const BaseManager = require("./BaseManager");
/**
 * Operate Firestore operations
 * @extends BaseManager
 */
class Manager extends BaseManager {
  /**
   * Save model into firestore document
   * @param {boolean} merge - Merge the fields with existing document or create
   * new document if it already not exist
   */
  async save(options = { merge: false }) {
    const docRef = this.__getDocRef;
    await docRef.set(this.__meta.parseFields, { merge: options.merge });
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }

  /**
   * Update model into firestore document
   * @param {string} id - document id
   * @param {string} key - document key
   */
  async update(by = { id, key }) {
    const docRef = this.__createDocRef(by);
    try {
      await docRef.update(this.__meta.parseFields);
    } catch (e) {
      throw new DocumentNotFound(
        `No document to update in collection ${
          this.__meta.collectionName
        } against ${by.id || by.key}`
      );
    }
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }
}

module.exports = Manager;
