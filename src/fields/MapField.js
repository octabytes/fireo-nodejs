const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
/**
 * Field for Object data
 * @extends BaseField
 */
class MapField extends BaseField {
  /**
   * Set MapField Value
   * @override
   * @param {Object} value - Object value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (value.constructor !== Object) {
      throw new InvalidFieldType(
        `${this.originalName} only accept Map(Object) value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = MapField;
