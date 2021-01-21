const TextField = require("./TextField");
const NumberField = require("./NumberField");

/**
 * Possible Fireo Fields
 */
class Field {
  static options = { required: false, default: undefined, name: undefined };

  static Text(options) {
    return new TextField(options);
  }

  static Number(options) {
    return new NumberField(options);
  }
}

module.exports = Field;
