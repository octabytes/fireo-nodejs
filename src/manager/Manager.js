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
}

module.exports = Manager;
