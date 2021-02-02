---
layout: default
title: Field
parent: Fields
nav_order: 11
---

# Base Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

All fields are extend from base `BaseField` This field can be used to store any kind of data in Firestore. This work also like **Dynamic Field** 

### Example Usage

```js
const {Model, BaseField} = require("fireo");

class User extends Model{
    name = new BaseField()
    age = new BaseField();
}


const u = User.init();
u.name = "Azeem";
u.age = 26;
await u.save();
```

## Allowed Attributes

The following attributes supported by DateTime Field.

1. [default](#default)
2. [required](#required)
3. [name](#custom-name)

- ### Default
Default value for field. This is base attribute that is available in all fields. Set default value for field if no value is provided

#### Example Usage
{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class User extends Model{
    name = Field.Text({default: "Azeem"});
}

const u = User.init();
await u.save();

console.log(u.name)  // Azeem
```

- ### Required
Set `true` if value is required for the field. If no value is provided error raise. 
This is base attribute that is available in all fields

#### Example Usage
{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class User extends Model{
    name = Field.Text({required: true});
}

const u = User.init();
u.name = "Azeem";
await u.save();
```

- ### Custom Name

Set different name in Firestore instead of field name. By default firestore name is same as the field name but you can change the firestore name in Firestore using this attribute. 
This is base attribute that is available in all fields

#### Example Usage
{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class User extends Model{
    name = Field.Text({name: "custom_name"});
}

const u = User.init();
u.name = "Azeem";
const u.save();
```
