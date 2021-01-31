const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
const { FieldValue } = require("@google-cloud/firestore");
/**
 * Field for Array data
 * @extends BaseField
 */
class ListField extends BaseField {
  /**
   * Set ListField Value
   * @override
   * @param {Array} value - Array value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (!Array.isArray(value) && value instanceof FieldValue === false) {
      throw new InvalidFieldType(
        `${this.originalName} only accept Array value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = ListField;
