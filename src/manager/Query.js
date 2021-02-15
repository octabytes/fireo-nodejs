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
   * Get Field DB
   * @param {string} name - Name of the field
   */
  __getField(name) {
    return this.__collection.__meta.fields[name];
  }

  /**
   * Get Field DB name
   * @param {string} name - Name of the field
   */
  __getFieldName(name) {
    return this.__getField(name).name;
  }

  /**
   * Filter firestore document
   * @param {string} field - Name of the field
   * @param {string} operator - Firestore operator
   * @param {string} value - value to search
   */
  where(field, operator, value) {
    const fieldName = this.__getFieldName(field);
    const f = this.__getField(field);
    f.setValue(value);

    let v = f.getValue;

    if (this.__collection.__meta.config.toLowercase) {
      try {
        v = value.toLowerCase();
      } catch (e) {}
    }

    if (this.__queryParameters.filters) {
      this.__queryParameters.filters.push({
        name: fieldName,
        operator,
        value: v,
      });
    } else {
      this.__queryParameters.filters = [
        { name: fieldName, operator, value: v },
      ];
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
   * Set parent key
   * @param {string} key - Key of parent document
   */
  parent(key) {
    this.__queryParameters.parent = key;
    return this;
  }

  /**
   * Transaction
   * @param {Transaction} t - Firestore transaction
   */
  transaction(t) {
    this.__transaction = t;
    return this;
  }

  /**
   * Delete documents by query
   * @param {boolean} child - Delete child docs and collections
   */
  async delete(child) {
    const result = await this.fetch();
    const docRefs = [];
    for (let doc of result.list) {
      docRefs.push(doc.__meta.extra.ref);
    }

    await this.__collection.__deleteCollectionDocs(docRefs, child);
  }

  /**
   * Retrieve firestore document
   * @param {number} limit - Limit the number of firestore documents
   */
  async fetch(limit) {
    let ref;

    if (this.__queryParameters.parent) {
      ref = firestore.conn.collection(
        this.__queryParameters.parent +
          "/" +
          this.__collection.__meta.collectionName
      );
    } else {
      ref = firestore.conn.collection(this.__collection.__meta.collectionName);
    }

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
    let snapshot;
    if (this.__transaction) {
      snapshot = await this.__transaction.get(ref);
    } else {
      snapshot = await ref.get();
    }

    const modelList = [];

    for (let doc of snapshot.docs) {
      const model = this.__collection.__modelObj.constructor.init();
      await model.__setFieldsValue({
        data: doc.data(),
        id: doc.id,
        key: this.__collection.__extractKeyFromDocRef(doc._ref),
        extra: {
          ref: doc._ref,
        },
      });
      modelList.push(model);
    }

    return {
      cursor: this.__encodeCursor(JSON.stringify(this.__queryCursor)),
      list: modelList,
    };
  }

  get __queryCursor() {
    const c = this.__queryParameters;
    if (this.__queryParameters.offset) {
      c.offset = this.__queryParameters.offset + this.__queryParameters.limit;
    } else {
      c.offset = this.__queryParameters.limit;
    }

    return c;
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
