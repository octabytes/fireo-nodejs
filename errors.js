/**
 * When wrong value type is added into field
 */
class InvalidFieldType extends Error {}

/**
 * When model is instantiate in wrong way
 * i.e when model is initialize from `new` keyword
 * instead of `Class.init()`
 */
class InstantiateError extends Error {}

/**
 * Required field
 */
class RequiredField extends Error {}

/**
 * Firestore document not found
 */
class DocumentNotFound extends Error {}

/**
 * Empty document can not save into firestore
 */
class EmptyDocument extends Error {}

/**
 * If key is not exist in Model
 */
class KeyNotExist extends Error {}

module.exports = {
  InvalidFieldType,
  InstantiateError,
  RequiredField,
  DocumentNotFound,
  EmptyDocument,
  KeyNotExist,
};
