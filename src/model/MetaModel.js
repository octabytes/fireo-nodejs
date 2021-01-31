const BaseField = require("../fields/BaseField");
const IDField = require("../fields/IDField");

/**
 * Meta class for model
 */
class MetaModel {
  constructor() {
    this.__meta = {};
  }

  /**
   * Configure the Model
   * @param {Object} config - Model config
   * @param {string} config.parent - Parent document key
   */
  __configure(config = { parent: undefined }) {
    this.__meta.config = this.constructor.config || {};
    this.__meta.parent = config.parent;
    this.__meta.isInstantiate = true;
    this.__meta.modelName = this.constructor.name;
    this.__getFields();
    this.__setCollectionName();
  }

  __setCollectionName() {
    this.__meta.collectionName =
      this.__meta.config.collectionName || this.constructor.name;
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

      if (field instanceof IDField) {
        field.configure({
          modelName: this.constructor.name,
          originalName: propertyName,
        });
        this.__meta.id = field;
        this[propertyName] = undefined;
        continue;
      }

      if (field instanceof BaseField) {
        field.configure({
          modelName: this.constructor.name,
          originalName: propertyName,
          toLowercase: this.__meta.config.toLowercase,
        });
        this.__meta.fields[propertyName] = field;
        this[propertyName] = undefined;
      }
    }
  }

  /**
   * parse field
   */
  __parseField() {
    this.__meta.parseFields = {};

    for (const [propertyName, field] of Object.entries(this.__meta.fields)) {
      const value = this[propertyName];
      if (value !== undefined) {
        field.setValue(this[propertyName]);
        this.__meta.parseFields[field.name] = field.getValue;
      }
    }

    // Set value of id field if any custom id provided
    if (this.__meta.id) {
      this.__meta.id.setValue(this[this.__meta.id.name]);
    }
  }

  /**
   * Set document id and key to this model object
   * @param {string} id - document id
   * @param {string} key - document key
   */
  __setIdAndKey(id, key) {
    this.key = key;

    if (this.__meta.id) {
      this[this.__meta.id.name] = id;
    } else {
      this.id = id;
    }
  }

  /**
   * Set values to model object
   * @param {Object} result - Document result
   * @param {Object} result.data - Document data
   * @param {string} result.id - Document ID
   * @param {string} result.key - Document key
   * @param {Any} result.extra - Any extra data which you want to add with model meta
   */
  async __setFieldsValue(result = { data, id, key, extra }) {
    for (const [propertyName, field] of Object.entries(this.__meta.fields)) {
      field.setDbValue(result.data[field.name]);
      this[propertyName] = await field.getDBValue();
    }

    this.__setIdAndKey(result.id, result.key);

    if (result.extra) {
      this.__meta.extra = result.extra;
    }
  }
}

module.exports = MetaModel;
