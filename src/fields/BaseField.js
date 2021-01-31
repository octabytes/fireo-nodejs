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
    this.toLowercase;
    this.required = options.required;
    this.default = options.default;
    this.customName = options.name;

    if (this.constructor.fieldOptions) {
      this.customOptions = {};
      for (const option of this.constructor.fieldOptions) {
        this.customOptions[option] = options[option];
      }
    }
  }

  /**
   * configure field
   * @param {string} modelName - Model name
   * @param {string} originalName - Field original name
   */
  configure(options = { modelName, originalName, toLowercase }) {
    this.modelName = options.modelName;
    this.originalName = options.originalName;
    this.toLowercase = options.toLowercase;
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
   * set db field value
   * @param {any} value - value for the field
   */
  setDbValue(value) {
    this.val = value;
  }

  /**
   * Get value
   */
  get getValue() {
    let fv = this.val;

    // If value is not provide set the default value
    if (fv === undefined) {
      if (this.default !== undefined) {
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

    // Check if custom options are set for this field
    if (this.customOptions) {
      for (const [option, value] of Object.entries(this.customOptions)) {
        fv = this["option_" + option]({
          optionValue: value,
          fieldValue: fv,
        });
      }
    }

    // Check if model config set to lowercase
    if (this.toLowercase) {
      if (this.constructor.fieldOptions.includes("toLowercase")) {
        fv = this["option_toLowercase"]({ optionValue: true, fieldValue: fv });
      }
    }

    return fv;
  }

  /**
   * Get DB value
   * Coming from Firestore and insert into model
   */
  async getDBValue() {
    return this.val;
  }
}

module.exports = BaseField;
