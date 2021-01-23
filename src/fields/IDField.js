/**
 * Field for Firestore document id
 */
class IDField {
  /**
   * @constructor
   */
  constructor() {
    this.val;
    this.originalName;
    this.modelName;
  }

  /**
   * configure the ID field
   * @param {string} originalName - Field name
   * @param {string} modelName - Name if the model
   */
  configure(config = { originalName, modelName }) {
    this.originalName = config.originalName;
    this.modelName = config.modelName;
  }

  /**
   * get field name
   */
  get name() {
    return this.originalName;
  }

  /**
   * Get value
   */
  get getValue() {
    return this.val;
  }

  /**
   * set id value
   * @param {string} value - custom id value
   */
  setValue(value) {
    this.val = value;
  }
}

module.exports = IDField;
