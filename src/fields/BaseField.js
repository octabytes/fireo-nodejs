const { RequiredField } = require("../../errors");
/**
 * Base class of all possible fields
 */
class BaseField {
  /**
   * @constructor
   * @param {Object} options - Common options for all fields to support
   */
  constructor(
    options = { required: false, default: undefined, name: undefined }
  ) {
    this.val;
    this.modelName;
    this.originalName;
    this.required = options.required;
    this.default = options.default;
    this.customName = options.name;
  }

  /**
   * configure field
   * @param {string} modelName - Model name
   * @param {string} originalName - Field original name
   */
  configure(options = { modelName, originalName }) {
    this.modelName = options.modelName;
    this.originalName = options.originalName;
  }

  /**
   * Get field name if custom name is set then
   * return the custom name otherwise return the
   * original name
   */
  get name() {
    if (this.customName) {
      return this.customName;
    }

    return this.originalName;
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
    let fv = this.val;

    // If value is not provide set the default value
    if (fv === undefined) {
      if (this.default) {
        fv = this.default;
      }
    }

    // Check required field
    if (fv === undefined && this.required) {
      throw new RequiredField(
        `Field ${this.originalName} is required in Model ${this.modelName}, 
        assign value or set default for ${this.originalName} field.`
      );
    }

    return fv;
  }

  /**
   * Get DB value
   * Coming from Firestore and insert into model
   */
  get getDBValue() {
    return this.val;
  }
}

module.exports = BaseField;
