---
layout: default
title: Custom Field
parent: Fields
nav_order: 12
---

# Custom Field
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Create your own custom fields, extend the class from base `BaseField` or you can extend any existing field also.

## Simple

You can create simplest field just by extending base `BaseField`

### Example Usage

{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class WeekDays extends BaseField{

}

class User extends Model{
    day = new WeekDays();
}

const u = User.init();
u.day = 1;
await u.save()
```

## Extend DB value

Control how the value of field will be save in Firestore. Override method `setValue()` to change the value.

### Example Usage

{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class WeekDays extends BaseField{
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    setValue(value){
        return this.days[value];
    }
}

const u = User.init();
u.day = 0;
await u.save();

// This will save "Mon" instead of "0" in Firestore
console.log(u.day)  // Mon
```

## Extend Field Value

Control how value represent when coming for Firestore. Override method `getDBValue()` to control this behavior.

### Example Usage

{: .no_toc }

```js
const {Model, BaseField} = require("fireo");

class WeekDays extends BaseField{
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

    setValue(value){
        return this.days[value];
    }

    async getDBValue() {
        return this.val + "-mod";
    }
}

const u = User.init();
u.day = 0;
await u.save()

// This will save "Mon" instead of "0" in Firestore
// But when you get value it will return "0" instead of "Mon"

const user = await User.collection.get({key: u.key});
console.log(user.day)  // 0
```

## Create attributes

[Default](/fireo-nodejs/fields/field#default), [Required](/fireo-nodejs/fields/field#required) and [Name](/fireo-nodejs/fields/field#custom-name)
attributes are allowed in every field. But you can create more attributes for your field.

### Method to create field attributes

Add filed attribute in the `fieldOptions` list and then create method for each attribute. Method name must be start from `option_` and then the name of the attribute. Method should return the value otherwise `undefined` value set for field

_Attribute Method run in the same order as they are specify in `fieldOptions`_

### Example Usage

```js
const {Model, BaseField} = require("fireo");

class EmailGenerator extends BaseField {
    static fieldOptions = ["prefix", "domain"];

    option_prefix({ optionValue, fieldValue }) {
    return optionValue + "." + fieldValue;
    }

    option_domain({ optionValue, fieldValue }) {
    return fieldValue + "@" + optionValue;
    }
}

class User extends Model {
    email = new EmailGenerator({ prefix: "prefix", domain: "example.com" });
}

const user = User.init();
user.email = "my_email";
await user.save();

// This will save email in Firestore like this "prefix.my_email@example.com"
console.log(u.email)  #  prefix.my_email@example.com
```
