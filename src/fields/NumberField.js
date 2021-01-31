const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
const { FieldValue } = require("@google-cloud/firestore");
/**
 * Field for Number data
 * @extends BaseField
 */
class NumberField extends BaseField {
  /**
   * Set NumberField Value
   * @override
   * @param {number} value - number value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (typeof value != "number" && value instanceof FieldValue === false) {
      throw new InvalidFieldType(
        `${this.originalName} only accept number value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = NumberField;
