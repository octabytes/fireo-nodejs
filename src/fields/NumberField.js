const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
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

    if (typeof value != "number") {
      throw new InvalidFieldType(
        `${this.originalName} only accept number value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = NumberField;
