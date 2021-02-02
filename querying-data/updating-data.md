---
layout: default
title: Updating Data
parent: Querying Data
nav_order: 2
---

# Updating Data
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Update document in Firestore collection

## Using Model Instance

Model instance has `update()` method you can update documents using this method

### Example Usage
{: .no_toc }

```js
const {Model, Field} = require("fireo");

class User extends Model {
    name = Field.Text();
    age = Field.Text();
}

const u = User.fromObject({name: "Azeem", age: 26});
await u.save();

// Update document
u.name = "Arfan";
await u.update();

console.log(u.name)  // Arfan
console.log(u.age)  // 26
```

## Using Key
Don't get document just for updating it. This is not efficient way you can pass `key` directly to `update()`
method.

**Don't Do This** *This will take two request one for getting data and second for updating*
```js
const u = await User.collection.get({key: user_key});
u.name = "Updated Name";
u.update();

console.log(u.name)  // Updated Name
console.log(u.age)  // 26
```

If you don't need to use document value then update the document just passing the `key`

**Do This** *This will take only one request to update document which is efficient*
```js
const u = User.init();
u.name = "Haider";
await u.update({key: user_key});

console.log(u.name)  // Haider
console.log(u.age)  // 26
```

### Passing key is not always efficient
{: .no_toc }

For example if you are creating new document and later you want to update it or if you getting document from 
query filter then passing `key` to `update()` is not make it efficient

### For Example
{: .no_toc }

```js
const user = await User.collection.where('name', '==', 'Azeem').get();
user.name = 'Update Name';

await user.update(user.key)  // This will not make it efficient and this is not recommended way

// Instead of this use update method without passing key
await user.update()  // Recommended way
```

## Update elements in an array
If your document contains an array field, you can use `listUnion()` and `listRemove()` to add and remove elements. 
`listUnion()` adds elements to an array but only elements not already present. `listRemove()` removes all 
instances of each given element.

```js
const city = await City.collection.get({key: city_key});

// Atomically add a new region to the 'regions' list field.
city.regions = Fireo.listUnion('greater_virginia');
await city.update();

// Atomically remove a region from the 'regions' List field.
city.regions = Fireo.listRemove('east_coast');
await city.update();
```

## Increment a numeric value
You can increment or decrement a numeric field value as shown in the following example. 
An increment operation increases or decreases the current value of a field by the given amount. 
If the field does not exist or if the current field value is not a numeric value, the operation 
sets the field to the given value.

```js
const city = await City.collection.get({key: city_key});

city.population = Fireo.increment(50);
await city.update();
```

## Sub Collection
Sub collection can also update in this same fashion