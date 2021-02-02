---
layout: default
title: Reserved Words
nav_order: 8
---

# Reserved Words
{: .no_toc }

Following list is reserved words by FireO. Don't use these words in Model or in custom fields
{: .fs-6 .fw-300 }

---
These words can be used in Firestore but not in Model as instance variable to class variable.

| Word            | Description                                                                      |
|:----------------|:---------------------------------------------------------------------------------|
| id              | Used to store model id, You can use it but only for [IDField](/fireo-nodejs/fields/id-field)  |
| key             | Store the model key, Don't use it                                                |
| collection      | Default Manager to operate Firestore operation                                   |
| __meta           | Store information about model |
