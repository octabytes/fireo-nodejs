const firestore = require("../../Firestore");
/**
 * Operate firestore query operator
 */
class Query {
  /**
   * @constructor
   * @param {Collection} collection - Collection object
   */
  constructor(collection) {
    this.__collection = collection;
  }

  /**
   * Get Field DB name
   * @param {string} name - Name of the field
   */
  __getFieldName(name) {
    return this.__collection.__meta.fields[name].name;
  }

  /**
   * Filter firestore document
   * @param {string} field - Name of the field
   * @param {string} operator - Firestore operator
   * @param {string} value - value to search
   */
  where(field, operator, value) {
    const fieldName = this.__getFieldName(field);

    if (this.__filters) {
      this.__filters.push({ name: fieldName, operator, value });
    } else {
      this.__filters = [{ name: fieldName, operator, value }];
    }

    return this;
  }

  /**
   * Retrieve firestore document
   */
  async fetch() {
    let ref = firestore.collection(this.__collection.__meta.collectionName);

    if (this.__filters) {
      for (const filter of this.__filters) {
        ref = ref.where(filter.name, filter.operator, filter.value);
      }
    }

    const docs = await ref.get();
    const modelList = [];

    docs.forEach((doc) => {
      const model = this.__collection.__modelObj.constructor.init();
      model.__setFieldsValue({
        data: doc.data(),
        id: doc.id,
        key: this.__collection.__extractKeyFromDocRef(doc._ref),
      });
      modelList.push(model);
    });

    return modelList;
  }
}

module.exports = Query;
