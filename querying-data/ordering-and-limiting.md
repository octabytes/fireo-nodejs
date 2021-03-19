---
layout: default
title: Ordering and Limiting
parent: Querying Data
nav_order: 4
---

# Ordering and Limiting

{: .no_toc }

## Table of contents

{: .no_toc .text-delta }

1. TOC
   {:toc}

---

FireO provides powerful query functionality for specifying which documents you want to retrieve from a
collection. These queries can also be used with either `get()` or `fetch()`

## Order and limit data

By default, a query retrieves all documents that satisfy the query in ascending order by document ID.
You can specify the sort order for your data using `orderBy()`, and you can limit the number of documents
retrieved using `limit()` or passing number of documents in `fetch(limit)`.

For example, you could query for the first 3 cities alphabetically with:

```js
await City.collection.orderBy("name").limit(3).fetch();

// Same thing can be achieved by passing limit in fetch() method
await City.collection.orderBy("name").fetch(3);
```

You could also sort in descending order to get the last 3 cities:

```js
await City.collection.orderBy("-name").fetch(3);
```

You can also order by multiple fields. For example, if you wanted to order by state,
and within each state order by population in descending order:

```js
await City.collection.orderBy("state").orderBy("-population");
```

You can combine `where()` with `order()` and `limit()`. In the following example,
the queries define a population threshold, sort by population in ascending order,
and return only the first few results that exceed the threshold:

```js
await City.collection
  .where("population", ">", 2500000)
  .orderBy("population")
  .limit(2)
  .fetch();
```

However, if you have a filter with a range comparison (`<`, `<=`, `>`, `>=`), your first ordering
must be on the same field:

**Valid:** Range filter and orderBy on the same field

```js
await City.collection
  .where("population", ">", 2500000)
  .orderBy("population")
  .fetch();
```

**Invalid:** Range filter and first orderBy on different fields

```js
await City.collection.where("population", ">", 2500000).orderBy("country");
```

## Limit data at end

Limit documents at the end of collection, For example you want to get the last 3
documents in ascending order.

**Note:** You must specify at least one orderBy clause for limitToLast queries, otherwise an exception will be thrown during execution.

```js
const { Model, Field } = require("fireo");

class LimitModel extends Model {
  number = Field.Number();
  collection_number = Field.Number();
  content = Field.Text();
}

const docs = await LimitModel.collection
  .where("collection_number", "==", 1)
  .orderBy("number")
  .limitToLast(3)
  .fetch();
```

## Sub collection

Sub collection queries work in same fashion but you need to pass `parent_key` to search in specific collection. Ordering and limiting apply same like other root collection

### Sample Data

{: .no_toc }

```js
const { Model, Field } = require("fireo");

class Post extends Model {
  title = Field.Text();
  content = Field.Text();
}

class Review extends Model {
  name = Field.Text();
  stars = Field.Number();
}

const p = Post.fromObject({ title: "First Post", content: "Some Content" });
await p.save();

const r1 = Review.init({ parent: p.key });
r1.name = "Azeem";
r1.stars = 5;
await r1.save();

const r2 = Review.init({ parent: p.key });
r2.name = "Arfan";
r2.stars = 3;
await r2.save();
```

### Example Usage

{: .no_doc }

The following query returns all reviews order by **review stars**

```js
const reviews = await Review.collection
  .parent(post_key)
  .orderBy("stars")
  .fetch();
```
