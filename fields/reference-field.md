---
layout: default
title: Reference Field
parent: Fields
nav_order: 10
---

# Reference Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

A DocumentReference refers to a document location in a Firestore database and can be used to write, read, or listen to the location. The document at the referenced location may or may not exist.

## Example Usage

```js
const {Model, Field} = require("fireo");

class Company extends Model{
    name = Field.Text();
}

class Employee extends Model{
    name = Field.Text();
    company = Field.Reference();
}

const c = Company.init();
c.name = "Abc_company";
await c.save()

const e = Employee.init();
e.name = 'Employee Name';
e.company = c.key;
await e.save();
```

## Allowed Attributes

The following attributes supported by Boolean Field.

1. [default](#default)
2. [required](#required)
3. [name](#custom-name)
4. [autoLoad](#auto-load)

- ### Default

  Default value for field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#default)

- ### Required

  Set `true` if value is required for the field. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#required)

- ### Custom Name

  Set different name in Firestore instead of field name. This is base attribute that is available in all fields. [Read More](/fireo-nodejs/fields/field#custom-name)


- ### Auto Load
  Load reference document automatically, If you disable the `auto_load` then you can get
  document by `get()` method.

### Example Usage

{: .no_toc }

```js
const {Model, Field} = require("fireo");

class Employee extends Model{
    name = Field.Text();
    company = Field.Reference({autoLoad: false});
}

const e = await Employee.collection.get({key: emp_key});
console.log(e.company);

// Reference document can be get using get() method
const com = e.company.get();
console.log(com.name)
```
