---
layout: default
title: Quickstart
nav_order: 3
---

# Quickstart
{: .no_toc }

This quickstart shows you how to set up Cloud Firestore, add, read, update and delete data by using the FireO.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Set up authentication

To run the client library, you must first set up [authentication](/fireo-nodejs/authentication)

## Add data

```js
const {Model, Field} = require("fireo")

class User extends Model {
    name = Field.Text();
    age = Field.Number();
}


const u = User.init();
u.name = "Azeem";
u.age = 26;
await u.save();

console.log(u.key)
```

## Getting Data

```js
const user = await User.collection.get({key: user_key});
console.log(user.name, user.age)
```

## Update Data

```js
const u = User.init();
u.name = "Arfan";
u.update(user_key);
```

## Delete Data

```js
await User.collection.delete({key: user_key});
```