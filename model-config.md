---
layout: default
title: Model Config
nav_order: 6
---

# Model Config
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

Here are some common configuration for `Model`

## Collection Name
Set collection name in Firestore if no collection name specify then by default Model name will be used for collection.

### Example Usage
{: .no_toc }

```js
const {Model, Field} = require("fireo");

class User extends Model{
    name = Field.Text();

    static config = {
        collectionName: "my_user_collection"
    }
}
```
