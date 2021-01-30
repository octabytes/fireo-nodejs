const { DocumentNotFound } = require("../../errors");
const BaseManager = require("./BaseManager");
const Query = require("./Query");
const firestore = require("../../Firestore");

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
   * @param {Object} options - Document id, key and transaction
   * @param {string} options.id - Document id
   * @param {string} options.key - Document key
   */
  async get({ id, key, transaction } = {}) {
    const docRef = this.__createDocRef({ id, key });

    let snapshot;
    if (transaction) {
      snapshot = await transaction.get(docRef);
    } else {
      snapshot = await docRef.get();
    }

    if (!snapshot.exists) {
      throw new DocumentNotFound(
        `Document not found in collection ${
          this.__meta.collectionName
        } against ${id || key}`
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
   * @param {boolean} by.child - Delete also child documents
   */
  async delete(by = { id: undefined, key: undefined, child: undefined }) {
    if (by.id || by.key) {
      const ref = this.__createDocRef(by);

      if (by.child) {
        await this.__deleteCollectionDocs([ref], true);
      } else {
        await ref.delete();
      }
    } else {
      const ref = firestore.collection(this.__meta.collectionName);
      const docs = await ref.listDocuments();
      await this.__deleteCollectionDocs(docs, by.child);
    }
  }

  /**
   * Delete collection docs
   * @param {Array} docList - List of doc ref
   * @param {boolean} child - Delete nested child collection docs
   */
  async __deleteCollectionDocs(docList, child) {
    let batchSize = 0;
    const batch = firestore.batch();
    for (let doc of docList) {
      if (child) {
        const docCollections = await doc.listCollections();
        if (docCollections.length) {
          for (let collection of docCollections) {
            await this.__deleteCollectionDocs(
              await collection.listDocuments(),
              child
            );
          }
        }
      }

      batch.delete(doc);
      batchSize++;
      if (batchSize >= 300) {
        await batch.commit();
        await this.__deleteCollectionDocs(docList.slice(batchSize), child);
        return;
      }
    }

    await batch.commit();
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

  /**
   * Order the document
   * @param {string} field - field name
   */
  orderBy(field) {
    const query = new Query(this);
    return query.orderBy(field);
  }

  /**
   * Create query from cursor
   * @param {string} queryCursor - Query cursor
   */
  cursor(queryCursor) {
    const query = new Query(this);
    return query.cursor(queryCursor);
  }

  /**
   * Set parent key
   * @param {string} key - Key of parent document
   */
  parent(key) {
    const query = new Query(this);
    return query.parent(key);
  }
}

module.exports = Collection;
