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
   * Limit firestore
   * @param {number} number - Limit number of results
   */
  limit(number) {
    this.__limit = number;
    return this;
  }

  /**
   * Order the document
   * @param {string} field - field name
   */
  orderBy(field) {
    if (field[0] === "-") {
      this.__addDocOrder(this.__getFieldName(field.slice(1)), "desc");
    } else {
      this.__addDocOrder(this.__getFieldName(field, "asc"));
    }

    return this;
  }
  __addDocOrder(field, order) {
    if (this.__order) {
      this.__order.push({ name: field, order: order });
    } else {
      this.__order = [{ name: field, order: order }];
    }
  }

  /**
   * Set firestore offset
   * @param {number} number - Starting number
   */
  offset(number) {
    this.__offset = number;
    return this;
  }

  /**
   * Retrieve firestore document
   * @param {number} limit - Limit the number of firestore documents
   */
  async fetch(limit) {
    let ref = firestore.collection(this.__collection.__meta.collectionName);

    if (this.__filters) {
      for (const filter of this.__filters) {
        ref = ref.where(filter.name, filter.operator, filter.value);
      }
    }

    if (this.__limit) {
      ref = ref.limit(this.__limit);
    }

    if (limit) {
      ref = ref.limit(limit);
    }

    if (this.__order) {
      for (const order of this.__order) {
        ref = ref.orderBy(order.name, order.order);
      }
    }

    if (this.__offset) {
      ref = ref.offset(this.__offset);
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

  /**
   * Get query first document
   */
  async get() {
    return (await this.fetch(1))[0];
  }
}

module.exports = Query;
