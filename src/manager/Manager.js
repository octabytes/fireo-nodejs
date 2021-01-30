const { Transaction } = require("@google-cloud/firestore");
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
   * @param {Transaction} options.transaction - Firestore transaction
   * new document if it already not exist
   */
  async save(options = { merge: false, transaction }) {
    const docRef = this.__getDocRef;
    if (options.transaction) {
      await options.transaction.set(docRef, this.__meta.parseFields, {
        merge: options.merge,
      });
    } else {
      await docRef.set(this.__meta.parseFields, { merge: options.merge });
    }
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }

  /**
   * Update model into firestore document
   * @param {Object} options - Update doc options
   * @param {string} options.id - document id
   * @param {string} options.key - document key
   * @param {Transaction} options.transaction - firestore transaction
   */
  async update({ id, key, transaction } = {}) {
    const docRef = this.__createDocRef({ id, key });
    try {
      if (transaction) {
        await transaction.update(docRef, this.__meta.parseFields);
      } else {
        await docRef.update(this.__meta.parseFields);
      }
    } catch (e) {
      throw new DocumentNotFound(
        `No document to update in collection ${
          this.__meta.collectionName
        } against ${id || key}`
      );
    }
    return { id: docRef.id, key: this.__extractKeyFromDocRef(docRef) };
  }

  /**
   * Delete document from firestore
   * @param {Object} options - Delete options
   * @param {string} options.key - Document key
   * @param {Transaction} options.transaction - Firestore transaction
   */
  async delete({ key, transaction } = {}) {
    const docRef = this.__createDocRef({ key: key });
    if (transaction) {
      await transaction.delete(docRef);
    } else {
      await docRef.delete();
    }
  }
}

module.exports = Manager;
