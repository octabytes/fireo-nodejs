---
layout: default
title: IDField
parent: Fields
nav_order: 1
---

# IDField
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

`Field.ID` is special field which is used to specify custom id for documents. If no id specify then id will be generated automatically.

## Example Usage

```js
const {Model, Field} = require("fireo");

class User extends Model{
    user_id = Field.ID();
}

const u = User.init();
u.user_id = "custom_doc_id";
await u.save();
// After save id will be saved in `user_id`
console.log(self.user_id)  // custom_doc_id
```
