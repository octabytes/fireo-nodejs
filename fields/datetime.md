---
layout: default
title: DateTime
parent: Fields
nav_order: 7
---

# DateTime Field
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
    created = Field.DateTime();
}

const u = User.init();
u.created = new Date();
```

## Allowed Attributes

The following attributes supported by Boolean Field.

1. [default](#default)
2. [required](#required)
3. [name](#custom-name)
4. [auto](#auto)

- ### Default

  Default value for field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#default)

- ### Required

  Set `true` if value is required for the field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#required)

- ### Custom Name

  Set different name in Firestore instead of field name. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#custom-name)


- ### Auto

Set the auto date if no value is provided

### Example Usage

{: .no_toc }

```js
const {Model, Field} = require("fireo");

class User extends Model{
    created = Field.DateTime({auto: true});
}

const u = User.init();
u.save()
console.log(u.created)
```
