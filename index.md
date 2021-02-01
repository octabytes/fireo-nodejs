---
layout: default
title: Home
nav_order: 1
description: "A modern and simplest convenient ORM package in NodeJs. FireO is specifically designed for 
the Google's Firestore"
permalink: /
---

# FireO is ORM package in NodeJs for the Google's Firestore
{: .fs-9 }

A modern and simplest convenient ORM package in NodeJs. FireO is specifically designed for the Google's Firestore. 
It implements validation, type checking, relational model logic and much more facilities. 
FireO is more than just ORM
{: .fs-6 .fw-300 }

[Quickstart](/fireo-nodejs/quick-start){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 } [View it on GitHub](https://github.com/octabytes/fireo-nodejs){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Getting started

### Installation

```shell
npm install fireo
```

### Example Usage

```js
const {Model, Field} = require("fireo);

class User extends Model{
    name = Field.Text();
}

const u = User.init();
u.name = "Azeem Haider";
await u.save();

// Get user
const user = await User.collection.get({key: u.key});
console.log(user.name);
```

## License

This is official [FireO](https://github.com/octabytes/fireo-nodejs) Repository. Powered by [OctaByte](https://octabyte.io)
Licensed under [Apache License 2.0](https://github.com/octabytes/fireo-nodejs/blob/master/LICENSE)