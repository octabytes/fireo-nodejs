---
layout: default
title: Map Field
parent: Fields
nav_order: 6
---

# Map Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Map field for firestore

## Example Usage

```js
const {Model, Field} = require("fireo");

class User extends Model{
    marks = Field.Map();
}

const u = User.init();
u.marks = {'Math': 70, 'English': 80}
```

## Allowed Attributes

The following attributes supported by Boolean Field.

1. [default](#default)
2. [required](#required)
3. [name](#custom-name)

- ### Default

  Default value for field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#default)

- ### Required

  Set `true` if value is required for the field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#required)

- ### Custom Name

  Set different name in Firestore instead of field name. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#custom-name)