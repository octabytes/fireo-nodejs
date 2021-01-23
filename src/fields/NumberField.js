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
    if (typeof value != "number") {
      throw new InvalidFieldType(
        `NumberField only accept number value, invalid value provided ${value} in model ${this.modelName}`
      );
    }

    this.val = value;
  }
}

module.exports = NumberField;
