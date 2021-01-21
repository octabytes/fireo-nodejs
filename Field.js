const TextField = require("./TextField");
const NumberField = require("./NumberField");

/**
 * Possible Fireo Fields
 */
class Field {
  static Text() {
    return new TextField();
  }

  static Number() {
    return new NumberField();
  }
}

module.exports = Field;
