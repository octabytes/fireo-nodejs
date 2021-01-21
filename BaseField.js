/**
 * Base class of all possible fields
 */
class BaseField {
  /**
   * @constructor
   */
  constructor() {
    this.val;
  }

  /**
   * set field value
   * @param {any} value - value for the field
   */
  setValue(value) {
    this.val = value;
  }

  /**
   * Get value
   */
  get getValue() {
    return this.val;
  }
}

module.exports = BaseField;
