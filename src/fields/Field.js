const TextField = require("./TextField");
const NumberField = require("./NumberField");

/**
 * Possible Fireo Fields
 */
class Field {
  static Text(
    options = { required: false, default: undefined, name: undefined }
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
