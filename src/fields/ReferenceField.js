const BaseField = require("./BaseField");
const firestore = require("../../Firestore");
const { InvalidFieldType } = require("../../errors");
const { DocumentReference } = require("@google-cloud/firestore");

/**
 * Fireo document reference
 */
class FireoDocRef {
  constructor(ref) {
    this.ref = ref;
  }

  async get() {
    const doc = await this.ref.get();
    return {
      id: doc.id,
      key: this.ref._path.segments.join("/"),
      ...doc.data(),
    };
  }
}

/**
 * Field for Reference doc data
 * @extends BaseField
 */
class ReferenceField extends BaseField {
  // Custom options for this field
  static fieldOptions = ["autoLoad"];

  option_autoLoad({ optionValue, fieldValue }) {
    return fieldValue;
  }

  /**
   * Set ReferenceField Value
   * @override
   * @param {string} value - Document key
   */
  setValue(value) {
    if (value === undefined) {
      return;
    }

    if (
      typeof value != "string" &&
      value instanceof DocumentReference === false
    ) {
      throw new InvalidFieldType(
        `${this.originalName} only accept value(string) value in model ${this.modelName}, invalid value provided "${value}"`
      );
    }

    if (value instanceof DocumentReference) {
      this.val = new FireoDocRef(value);
    } else {
      this.val = firestore.doc(value);
    }
  }

  /**
   * Modify coming value from firestore
   * @override
   */
  async getDBValue() {
    if (this.customOptions.autoLoad) {
      return await this.val.get();
    }

    return this.val;
  }
}

module.exports = ReferenceField;
