const TextField = require("./TextField");
const NumberField = require("./NumberField");
const IDField = require("./IDField");

/**
 * Possible Fireo Fields
 */
class Field {
  static ID() {
    return new IDField();
  }
  static Text(
    options = {
      required: false,
      default: undefined,
      name: undefined,
      toLowercase: undefined,
    }
  ) {
    return new TextField(options);
  }

  static Number(
    options = { required: false, default: undefined, name: undefined }
  ) {
    return new NumberField(options);
  }
}

module.exports = Field;
