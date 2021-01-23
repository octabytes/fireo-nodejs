const { DocumentNotFound } = require("../../errors");
const BaseManager = require("./BaseManager");
/**
 * Operate Firestore operations
 * @extends BaseManager
 */
class Manager extends BaseManager {
  /**
   * Save model into firestore document
   * @param {Object} options - Save options
   * @param {boolean} options.merge - Merge the fields with existing document or create
   * new document if it already not exist
   */
  async save(options = { merge: false }) {
    const docRef = this.__getDocRef;
    await docRef.set(this.__meta.parseFields, { merge: options.merge });
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }

  /**
   * Update model into firestore document
   * @param {Object} by - Document id or key
   * @param {string} by.id - document id
   * @param {string} by.key - document key
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

  /**
   * Delete document from firestore
   * @param {string} key - Document key
   */
  async delete(key) {
    const docRef = this.__createDocRef({ key: key });
    await docRef.delete();
  }
}

module.exports = Manager;
