const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
/**
 * Field for Text data
 * @extends BaseField
 */
class TextField extends BaseField {
  /**
   * Set TextField Value
   * @override
   * @param {string} value - string value
   */
  setValue(value) {
    if (typeof value != "string") {
      throw new InvalidFieldType(
        `${this.originalName} only accept string value, invalid value provided ${value} in model ${this.modelName}`
      );
    }

    this.val = value;
  }
}

module.exports = TextField;
