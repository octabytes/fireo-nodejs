const BaseManager = require("./BaseManager");
/**
 * Operate Firestore operations
 * @extends BaseManager
 */
class Manager extends BaseManager {
  /**
   * Save model into firestore document
   */
  async save() {
    const docRef = this.__getDocRef;
    await docRef.set(this.__meta.parseFields);
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }
}

module.exports = Manager;
