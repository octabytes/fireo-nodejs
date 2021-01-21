const { InstantiateError } = require("../../errors");
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
   */
  async save() {
    this.__parseField();
  }
}

module.exports = Model;
