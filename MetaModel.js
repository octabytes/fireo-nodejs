const BaseField = require("./BaseField");

/**
 * Meta class for model
 */
class MetaModel {
  constructor() {
    this.__meta = {};
  }

  /**
   * Configure the Model
   */
  __configure() {
    this.__meta.isInstantiate = true;
    this.__getFields();
  }

  /**
   * Get Model fields
   */
  __getFields() {
    this.__meta.fields = {};

    const allProperties = Object.getOwnPropertyNames(this);
    const properties = allProperties.filter((f) => f != "__meta");
    for (const propertyName of properties) {
      const field = this[propertyName];
      if (field instanceof BaseField) {
        this.__meta.fields[propertyName] = field;
        this[propertyName] = undefined;
      }
    }
  }
}

module.exports = MetaModel;
