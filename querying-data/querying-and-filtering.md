---
layout: default
title: Querying and Filtering
parent: Querying Data
nav_order: 3
---

# Querying and Filtering
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

FireO provides powerful query functionality for specifying which documents you want to retrieve from a collection. These queries can also be used with either `get()` or `fetch()`

## Example data
To get started, write some data about cities so we can look at different ways to read it back:

```js
const {Model, Field} = require("fireo");

class City extends Model{
    short_name = Field.ID();
    name = Field.Text();
    state = Field.Text();
    country = Field.Text();
    capital = Field.Boolean();
    population = Field.Number();
    regions = Field.List();
}

const c1 = City.fromObject({
    short_name: 'SF', name: 'San Francisco', state: 'CA', country: 'USA', 
    capital: false, population: 860000, regions: ['west_coast', 'norcal']
});
await c1.save();

const c2 = City.fromObject({
    short_name: 'LA', name: 'Los Angeles', state: 'CA', country: 'USA', 
    capital: false, population: 3900000, regions: ['west_coast', 'socal']
});
await c2.save();

const c3 = City.fromObject({
    short_name: 'DC', name: 'Washington D.C.', state: 'CA', country: 'USA', 
    capital: true, population: 680000, regions: ['east_coast']
});
await c3.save();

const c4 = City.fromObject({
    short_name: 'TOK', name: 'Tokyo', country: 'Japan', 
    capital: true, population: 9000000, regions: ['kanto', 'honshu']
});
await c4.save();

const c5 = City.fromObject({
    short_name: 'BJ', name: 'Beijing', country: 'China', 
    capital: true, population: 21500000, regions: ['hebei']
});
```

## Simple Queries
The following query returns all cities with state **CA**

```js
await City.collection.where('state', '==', 'CA').fetch();
```

The following query returns all the capital cities

```js
await City.collection.where('capital', '==', true).fetch();
```

## Get First result
After creating a query object, use the `get()` function to retrieve the first matching result.
`fetch()` return all mating result.

The following query returns first matching city with state **CA**

```js
const city = await City.collection.where('state', '==', 'CA').get();
```

## Query operators
The `where()` method takes three parameters: a field to filter on, a comparison operation, and a value. The comparison can be `<`, `<=`, `==`, `>`, `>=`, `array-contains`, `in` and `array-contains-any`.

Some example filters:
```js
await City.collection.where('state', '==', 'CA');
await City.collection.where('population', '<', 1000000);
await City.collection.where('name', '>=', 'San Francisco');
```

## List membership
You can use the `array-contains` operator to filter based on list values. For example:
```js
City.collection.where('regions', 'array_contains', 'west_coast');
```

This query returns every **city** document where the **regions** field is an array that contains **west_coast**. If the array has multiple instances of the value you query on, the document is included in the results only once.

## in and array-contains-any
Use the `in` operator to combine up to 10 equality (`==`) clauses on the same field with a logical `OR`. An `in` query returns documents where the given field matches any of the comparison values. For example:

```js
City.collection.where('country', 'in', ['USA', 'Japan']);
```

This query returns every `city` document where the `country` field is set to `USA` or `Japan`. 
From the example data, this includes the `SF`, `LA`, `DC`, and `TOK` documents.

Similarly, use the `array-contains-any` operator to combine up to 10 `array-contains` clauses on the same field 
with a logical `OR`. An `array-contains-any` query returns documents where the given field is an array that contains 
one or more of the comparison values:

```js
City.collection.where(
    'regions', 'array_contains_any', ['west_coast', 'east_coast']
)
```

This query returns every city document where the `region` field is an array that contains `west_coast` or `east_coast`. 
From the example data, this includes the `SF`, `LA`, and `DC` documents.

Results from `array-contains-any` are de-duped. Even if a document's array field matches more than one of the 
comparison values, the result set includes that document only once.

`array-contains-any` always filters by the array data type. For example, the query above would not return a 
city document where instead of an array, the `region` field is the string `west_coast`.

You can use an array value as a comparison value for `in`, but unlike `array_contains_any`, 
the clause matches for an exact match of array length, order, and values. For example:

```js
City.where(
    'regions', 'in', [['west_coast'], ['east_coast']]
)
```

This query returns every city document where the `region` field is an array that contains 
exactly one element of either `west_coast` or `east_coast`. From the example data, only the `DC` 
document qualifies with its `region` field of `["east_coast"]`. The `SF` document, however, does 
not match because its `region` field is `["west_coast", "norcal"]`.

### Limitations
{: .no_toc }
Note the following limitations for `in` and `array-contains-any`:

- `in` and `array-contains-any` support up to 10 comparison values.
- You can use only one `in` or `array-contains-any` clause per query. You can't use both `in` and `array-contains-any` 
in the same query.
- You can combine `array-contains` with `in` but not with `array-contains-any`.

## Compound queries
You can also chain multiple `filter()` methods to create more specific queries (logical `AND`). 
However, to combine the equality operator (`==`) with a range or array-contains 
clause (`<`, `<=`, `>`, `>=`, or `array-contains`), make sure to create a [composite index](https://cloud.google.com/firestore/docs/query-data/indexing).

```js
const sydney_query = City.collection.where('state', '==', 'CO').where('name', '==', 'Denver');

const large_us_cities_query = City.collection.where('state', '==', 'CA').where('population', '>', 1000000);
```

You can only perform range comparisons (`<`, `<=`, `>`, `>=`) on a single field, and you can include at 
most one `array-contains` clause in a compound query:

**Valid:** Range filters on only one field
```js
City.collection.where('state', '>=', 'CA').where('state', '<=', 'IN');
```

**Invalid:** Range filters on different fields
```js
City.collection.where('state', '>=', 'CA').where('population', '>=', 1000000)
```

## Sub collection
Sub collection queries work in same fashion but you need to pass `parent_key` to search in specific collection.

### Sample Data
{: .no_toc }

```js
const {Model, Field} = require("fireo");

class Post extends Model{
    title = Field.Text();
    content = Field.Text();
}

class Review extends Model{
    name = Field.Text();
    stars = Field.Number();
}

const p = Post.fromObject({title: "First Post", content: "Some Content"});
await p.save();

const r1 = Review.init({parent: p.key});
r1.name = 'Azeem';
r1.stars = 5;
await r1.save();

const r2 = Review.init({parent: p.key});
r2.name = 'Arfan';
r2.stars = 3;
await r2.save();
```

### Example Usage
{: .no_doc }

The following query returns all reviews which is posted by **Azeem**

```js
await Review.collection.parent(post_key).where('name', '==', 'Azeem').fetch();
```

## Query limitations
Cloud Firestore does not support the following types of queries:

- Queries with range filters on different fields, as described in the previous section.
- Queries with a `!=` clause. In this case, you should split the query into a greater-than query 
and a less-than query. For example, although the query clause `where("age", "!=", "30")` is not supported, 
you can get the same result set by combining two queries, one with the clause `where("age", "<", "30")` and 
one with the clause `where("age", ">", 30)`.
- Cloud Firestore provides limited support for logical `OR` queries. The `in` and `array-contains-any` operators 
support a logical `OR` of up to 10 equality (`==`) or `array-contains` conditions on a single field. For other cases, 
create a separate query for each `OR` condition and merge the query results in your app.