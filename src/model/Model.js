const {
  InstantiateError,
  EmptyDocument,
  KeyNotExist,
} = require("../../errors");
const Collection = require("../manager/Collection");
const Manager = require("../manager/Manager");
const MetaModel = require("./MetaModel");
/**
 * Firestore document model
 * @extends MetaModel
 */
class Model extends MetaModel {
  /**
   * @constructor
   * @param {boolean} isInstantiate - Object is instantiate from init() method or not
   */
  constructor(isInstantiate = false) {
    super();

    if (!isInstantiate) {
      throw new InstantiateError(
        `Model ${this.constructor.name} should be instantiate from init() method, 
        User ${this.constructor.name}.init() instead of new ${this.constructor.name}`
      );
    }
  }

  /**
   * Create model from parent key
   * @param {string} key - Parent document key
   */
  static parent(key) {
    const obj = new this(true);
    obj.__configure({ parent: key });
    return obj;
  }

  /**
   * Instantiate Model
   * @param {Object} config - Model config
   * @param {string} config.parent - Parent document key
   */
  static init(config = { parent: undefined }) {
    const obj = new this(true);
    obj.__configure(config);
    return obj;
  }

  /**
   * Static Create model instance from key value object
   * @param {Object} map - Key value pair of model fields
   */
  static fromObject(map) {
    const obj = new this(true);
    obj.__configure();
    const properties = obj.__getModelProperties;
    for (const propertyName of properties) {
      obj[propertyName] = map[propertyName];
    }
    return obj;
  }

  /**
   * Create model instance from key value object
   * @param {Object} map - Key value pair of model fields
   */
  fromObject(map) {
    const properties = this.__getModelProperties;
    for (const propertyName of properties) {
      this[propertyName] = map[propertyName];
    }
    return this;
  }

  /**
   * Convert Model object into key value pair object
   */
  toObject() {
    const map = {};
    const properties = this.__getModelProperties;
    for (const propertyName of properties) {
      map[propertyName] = this[propertyName];
    }

    return map;
  }

  /**
   * Save model into firestore document
   * @param {Object} options - Options for save docu
   * @param {boolean} options.merge - Merge the fields with existing document or create
   * @param {Transaction} options.transaction - Firestore transaction
   * @param {Batch} options.batch - Firestore batch
   * new document if it already not exist
   */
  async save({ merge = false, transaction, batch } = {}) {
    this.__parseField();

    // Check if document id not empty
    if (Object.keys(this.__meta.parseFields).length === 0) {
      throw new EmptyDocument(
        `Trying to save empty document in firestore from ${this.constructor.name}`
      );
    }

    const manager = new Manager(this.__meta);
    const transOrBatch = transaction || batch;
    const { id, key } = await manager.save({
      merge,
      transaction: transOrBatch,
    });
    this.__setIdAndKey(id, key);
  }

  /**
   * Merge the fields with existing document or create
   * new document if it already not exist
   * @param {Object} options - Options
   * @param {Transaction} options.transaction - Firestore transaction
   * @param {Batch} options.batch - Firestore batch
   */
  async upsert({ transaction, batch } = {}) {
    await this.save({ merge: true, transaction, batch });
  }

  /**
   * Update existing firestore document
   * @param {Object} options - Update options
   * @param {string} options.id - document id
   * @param {string} options.key - document key
   * @param {Transaction} options.transaction - Firestore transaction
   * @param {Batch} options.batch - Firestore batch
   */
  async update({ id = undefined, key = undefined, transaction, batch } = {}) {
    let result;
    this.__parseField();
    const manager = new Manager(this.__meta);

    if (!id && !key) {
      if (!this.key) {
        throw new KeyNotExist(
          `No key exist in Model ${this.constructor.name}, provide id or key in update() method`
        );
      }

      result = await manager.update({ key: this.key });
    } else {
      const transOrBatch = transaction || batch;
      result = await manager.update({ id, key, transaction: transOrBatch });
    }
    this.__setIdAndKey(result.id, result.key);
  }

  /**
   * Delete document from firestore
   * @param {Object} options - Delete options
   * @param {Transaction} options.transaction - Firestore transaction
   * @param {Batch} options.batch - Firestore batch
   */
  async delete({ transaction, batch } = {}) {
    if (!this.key) {
      throw new KeyNotExist(`No key exist in Model ${this.constructor.name}`);
    }

    const manager = new Manager(this.__meta);
    const transOrBatch = transaction || batch;
    await manager.delete({ key: this.key, transaction: transOrBatch });
  }

  /**
   * Perform firestore static operations which does not need
   * of model object i.e get, query etc
   */
  static get collection() {
    const obj = this.init();
    return new Collection(obj);
  }
}

module.exports = Model;
