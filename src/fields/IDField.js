/**
 * Field for Firestore document id
 */
class IDField {
  /**
   * @constructor
   */
  constructor() {
    this.val;
    this.name;
    this.modelName;
  }

  /**
   * configure the ID field
   * @param {string} name - Field name
   * @param {string} modelName - Name if the model
   */
  configure(config = { name, modelName }) {
    this.name = config.name;
    this.modelName = config.modelName;
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
