---
layout: default
title: Getting Data
parent: Querying Data
nav_order: 1
---

# Getting Data
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Read documents from Google's Firestore

## Single Document
Read single document from collection

### Example Usage
{: .no_toc }

```js
const u = await User.collection.get({key: user_key});

console.log(u.name);
console.log(u.key);
```

Convert model into `object`

```js
const u = await User.collection.get({key: user_key});
console.log(u.toObject());
```

## All Documents
Read all documents from collection

### Example Usage
{: .no_toc }

```js
const userList = await User.collection.fetch();

for (let user of userList){
    console.log(user.id, user.name);
}
```

## Sub Collection
Get child documents from collection

### Example Usage
{: .no_toc }

```js
const users = await User.collection.parent(parent_key).fetch();

for (let user of users){
    console.log(user.id, user.name);
}
```