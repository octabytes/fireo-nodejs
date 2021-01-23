const { InstantiateError, EmptyDocument } = require("../../errors");
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

  static init() {
    const obj = new this(true);
    obj.__configure();
    return obj;
  }

  /**
   * Save model into firestore document
   * @param {boolean} merge - Merge the fields with existing document or create
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

  async upsert() {
    await this.save({ merge: true });
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
