---
layout: default
title: Deleting Data
parent: Managing Data
nav_order: 2
---

# Deleting Data
{: .no_toc }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---
Delete single model or all collection. 

## Delete document
To delete single document pass `key` to manager

### Example Usage
{: .no_toc }

```js
await User.collection.delete({key: user_key});
```

## Delete collection
Delete all documents from collection

### Example Usage
{: .no_toc }

```js
await User.collection.delete();
```

## Delete sub collection
Deleting any document not delete it's sub collection you need to delete them separately but you can pass `child=True` to delete all its `sub collections`

Suppose you want to delete `post` and all it's `reviews`

```js
await Post.collection.delete({key: post_key, child: true})
```

This will delete the `post` and all it's `sub collection` in this case `reviews` if `reviews` has any other `sub collection` these will also delete.

## Delete by query
FireO also allow you to delete multiple documents by **query**

```js
await Post.collection.where("title", "==", "some title").delete();
```