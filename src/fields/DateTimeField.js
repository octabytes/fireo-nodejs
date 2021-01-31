const { FieldValue } = require("@google-cloud/firestore");
const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
/**
 * Field for DateTime data
 * @extends BaseField
 */
class DateTimeField extends BaseField {
  static fieldOptions = ["auto"];

  option_auto({ optionValue, fieldValue }) {
    if (optionValue === true) {
      return FieldValue.serverTimestamp();
    }

    return fieldValue;
  }

  /**
   * Set DateTimeField Value
   * @override
   * @param {Date} value - DateTime value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (value instanceof Date === false) {
      throw new InvalidFieldType(
        `${this.originalName} only accept Date value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = DateTimeField;
