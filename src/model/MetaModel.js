const BaseField = require("../fields/BaseField");

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
   * Get Model properties
   */
  get __getModelProperties() {
    const allProperties = Object.getOwnPropertyNames(this);
    return allProperties.filter((f) => f != "__meta");
  }

  /**
   * Get Model fields
   */
  __getFields() {
    this.__meta.fields = {};

    const properties = this.__getModelProperties;
    for (const propertyName of properties) {
      const field = this[propertyName];
      if (field instanceof BaseField) {
        field.configure(this.constructor.name);
        this.__meta.fields[propertyName] = field;
        this[propertyName] = undefined;
      }
    }
  }

  /**
   * parse field
   */
  __parseField() {
    this.__meta.fields.parse = {};

    const properties = this.__getModelProperties;

    for (const propertyName of properties) {
      const value = this[propertyName];
      const field = this.__meta.fields[propertyName];

      field.setValue(value);
    }
  }
}

module.exports = MetaModel;
