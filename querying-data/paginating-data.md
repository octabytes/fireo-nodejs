---
layout: default
title: Paginating Data
parent: Querying Data
nav_order: 5
---

# Paginating Data
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

FireO split data returned by a query into batches according to the parameters you define in your query.

## Query cursor
This is powerful tool by FireO. You can create `cursor` from your query and save it as `string` and use it later.

### Example Usage

```js
const cities = await City.collection.where('state', '==', 'CA').orderBy('name').fetch(10);

// city list contain the first 10 matching cities
console.log(cities.list);
console.log(cities.cursor);
```

`cities.cursor` return the `string` that you can use later at some place to start the query at this specific point.

```js
// Fetch another 10 cities 
const cities = await City.collection.cursor(city_cursor).fetch();

for (let city of cities.list){
    console.log(city);
}
```