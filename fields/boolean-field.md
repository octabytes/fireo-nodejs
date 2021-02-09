---
layout: default
title: Boolean Field
parent: Fields
nav_order: 4
---

# Boolean Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Example Usage

```js
const {Model, Field} = require("fireo");

class User extends Model{
    is_student = Field.Boolean();
}

const u = User.init();
u.is_student = true
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