---
layout: default
title: Adding Data
parent: Managing Data
nav_order: 1
---

# Adding Data
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Adding Data
Create model object and add values to it and `save()` the model. After saving model **model id** and 
**model key** is attached with model object.

### Example Usage

```js
const {Model, Field} = require("fireo);


class User extends Model {
    name = Fireo.Text();
    age = Fireo.Number();
}


const u = User.init();
u.name = "Azeem";
u.age = 26;
await u.save();

console.log(u.id)  # xaIkLAGEjkSON
console.log(u.key)  # user/xaIkLAGEjkSON 
``` 

`key` contain more information e.g **id, parent collection, parent document** 
`key` also used for creating sub collections.

### Create fromObject
Model can also create from `fromObject`

#### Example Usage
{: .no_toc }
```js
const u = User.fromObject({name: "Azeem", age: 27});
await u.save()

console.log(u.id)  # xaIkLAGEjkSON
console.log(u.key)  # user/xaIkLAGEjkSON
```

### Custom id
Custom id can also be specified by using [IDField](/fields/id-field)

### Example Usage
{: .no_toc }

```js
const {Model, Field} = require("fireo);

class User extends Model{
    user_id = Field.ID();
    name = Field.Text();
    age = Field.Number();
}


const u = User.init();
u.user_id = 'custom_doc_id';
u.name = "Azeem";
u.age = 26;
await u.save();

console.log(u.user_id)  # custom_doc_id
```

If you add [IDField](/fields/id-field) and not specify any id then id will be stored in this field.

#### Example
{: .no_toc }

```js
const u = User.init();
u.name = "Azeem";
u.age = 26;
await u.save();

console.log(u.user_id)  # xaIkLAGEjkSON

# u.id will be None in this case
console.log(u.id)  # None
```

You can choose any name for id field it can be **id** itself

## Upsert (Merge fields)
If the document does not exist, it will be created. If the document does exist, its data should be **merged** into the existing document, as follows

### Example Usage
```js
const u = User.init();
u.id = "custom-id";
u.name = "Azeem";
await u.save({merge: true);
# OR
await u.upsert()

# Both upsert() and save({merge: true) is same thing
```
If you're not sure whether the document exists, pass the option to merge the new data with any existing document to avoid overwriting entire documents.

## Sub collection
A sub collection is a collection associated with a specific document. In FireO world you can save one model inside another model parent child relation.

### Example Usage

```js
const {Model, Field} = require("fireo);

class Post extends Model{
    title = Field.Text();
    content = Field.Text();
}

class Review extends Model{
    name = Field.Text();
    message = Field.Text();
}

const p = Post.init();
p.title = "My First Post";
p.content = "Post content";
await p.save()

const r = Review.init({parent: p.key});
r.name = "Azeem";
r.message = "Nice post";
await r.save();

console.log(r.key)
```