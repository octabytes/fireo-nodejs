const { GeoPoint } = require("@google-cloud/firestore");
const BaseField = require("./BaseField");
const { InvalidFieldType } = require("../../errors");
/**
 * Field for GeoPoint data
 * @extends BaseField
 */
class GeoPointField extends BaseField {
  /**
   * Set GeoPointField Value
   * @override
   * @param {GeoPoint} value - GeoPoint value
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (value instanceof GeoPoint === false) {
      throw new InvalidFieldType(
        `${this.originalName} only accept GeoPoint value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    this.val = value;
  }
}

module.exports = GeoPointField;
