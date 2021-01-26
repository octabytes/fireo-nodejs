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
    this.__queryParameters = {};
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

    if (this.__queryParameters.filters) {
      this.__queryParameters.filters.push({ name: fieldName, operator, value });
    } else {
      this.__queryParameters.filters = [{ name: fieldName, operator, value }];
    }

    return this;
  }

  /**
   * Limit firestore
   * @param {number} number - Limit number of results
   */
  limit(number) {
    this.__queryParameters.limit = number;
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
    if (this.__queryParameters.order) {
      this.__queryParameters.order.push({ name: field, order: order });
    } else {
      this.__queryParameters.order = [{ name: field, order: order }];
    }
  }

  /**
   * Set firestore offset
   * @param {number} number - Starting number
   */
  offset(number) {
    this.__queryParameters.offset = number;
    return this;
  }

  /**
   * Create query from cursor
   * @param {string} queryCursor - Query cursor
   */
  cursor(queryCursor) {
    const c = this.__decodeCursor(queryCursor);
    this.__queryParameters = JSON.parse(c);
    return this;
  }

  /**
   * Retrieve firestore document
   * @param {number} limit - Limit the number of firestore documents
   */
  async fetch(limit) {
    let ref = firestore.collection(this.__collection.__meta.collectionName);

    if (this.__queryParameters.filters) {
      for (const filter of this.__queryParameters.filters) {
        ref = ref.where(filter.name, filter.operator, filter.value);
      }
    }

    if (this.__queryParameters.limit) {
      ref = ref.limit(this.__queryParameters.limit);
    }

    if (limit) {
      this.__queryParameters.limit = limit;
      ref = ref.limit(limit);
    }

    if (this.__queryParameters.order) {
      for (const order of this.__queryParameters.order) {
        ref = ref.orderBy(order.name, order.order);
      }
    }

    if (this.__queryParameters.offset) {
      ref = ref.offset(this.__queryParameters.offset);
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

    return {
      cursor: this.__encodeCursor(JSON.stringify(this.__queryParameters)),
      list: modelList,
    };
  }

  __encodeCursor(cursor) {
    const buffer = Buffer.from(cursor, "utf8");
    return buffer.toString("base64");
  }

  __decodeCursor(cursor) {
    const buffer = Buffer.from(cursor, "base64");
    return buffer.toString("utf8");
  }

  /**
   * Get query first document
   */
  async get() {
    return (await this.fetch(1)).list[0];
  }
}

module.exports = Query;
