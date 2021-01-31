const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
/**
 * Field for Boolean data
 * @extends BaseField
 */
class BooleanField extends BaseField {
  /**
   * Set BooleanField Value
   * @override
   * @param {boolean} value - boolean value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (typeof value != "boolean") {
      throw new InvalidFieldType(
        `${this.originalName} only accept boolean value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = BooleanField;
