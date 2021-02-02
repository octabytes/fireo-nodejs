---
layout: default
title: GeoPoint
parent: Fields
nav_order: 8
---

# GeoPoint Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Example Usage

```js
const {Model, Field, Fireo} = require("fireo");

class User extends Model{
    location = Field.GeoPoint();
}

const u = User.init();
u.location = Fireo.GeoPoint(123.23, 421.12);
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
