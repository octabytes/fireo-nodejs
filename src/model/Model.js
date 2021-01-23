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
   * Save model into firestore document
   * @param {Object} options - Save options
   * @param {boolean} options.merge - Merge the fields with existing document or create
   * new document if it already not exist
   */
  async save(options = { merge: false }) {
    this.__parseField();

    // Check if document id not empty
    if (Object.keys(this.__meta.parseFields).length === 0) {
      throw new EmptyDocument(
        `Trying to save empty document in firestore from ${this.constructor.name}`
      );
    }

    const manager = new Manager(this.__meta);
    const { id, key } = await manager.save(options);
    this.__setIdAndKey(id, key);
  }

  /**
   * Merge the fields with existing document or create
   * new document if it already not exist
   */
  async upsert() {
    await this.save({ merge: true });
  }

  /**
   * Update existing firestore document
   * @param {Object} by - Document id or key
   * @param {string} by.id - document id
   * @param {string} by.key - document key
   */
  async update(by = { id: undefined, key: undefined }) {
    let result;
    this.__parseField();
    const manager = new Manager(this.__meta);

    if (!by.id && !by.key) {
      if (!this.key) {
        throw new KeyNotExist(
          `No key exist in Model ${this.constructor.name}, provide id or key in update() method`
        );
      }

      result = await manager.update({ key: this.key });
    } else {
      result = await manager.update(by);
    }
    this.__setIdAndKey(result.id, result.key);
  }

  /**
   * Delete document from firestore
   */
  async delete() {
    if (!this.key) {
      throw new KeyNotExist(`No key exist in Model ${this.constructor.name}`);
    }

    const manager = new Manager(this.__meta);
    await manager.delete(this.key);
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
