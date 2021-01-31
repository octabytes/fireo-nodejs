const IDField = require("./IDField");
const TextField = require("./TextField");
const NumberField = require("./NumberField");
const BooleanField = require("./BooleanField");
const ListField = require("./ListField");

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

  static Boolean(
    options = { required: false, default: undefined, name: undefined }
  ) {
    return new BooleanField(options);
  }

  static List(
    options = { required: false, default: undefined, name: undefined }
  ) {
    return new ListField(options);
  }
}

module.exports = Field;
