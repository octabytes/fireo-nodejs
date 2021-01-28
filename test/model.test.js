const chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const { InstantiateError } = require("../errors");
const firestore = require("../Firestore");

const expect = chai.expect;

describe("Model", () => {
  class User extends Model {
    name = Field.Text();
  }

  it("should be instantiate from `init()`", () => {
    const user = User.init();
    expect(user.__meta.isInstantiate).be.true;
  });
  it("should not be instantiate from `new` keyword", () => {
    expect(() => new User()).to.throw(InstantiateError);
  });
  it("`init()` method should return the instance of class", () => {
    expect(User.init() instanceof User).to.be.true;
  });
  it("after getting fields record every field should be undefined", () => {
    const user = User.init();
    expect(user.name).to.be.undefined;
  });

  it("able to set custom collection", async () => {
    User.config = {
      collectionName: "custom_collection",
    };

    const user = User.init();
    user.name = "string";
    await user.save();

    const snapshot = await firestore
      .collection("custom_collection")
      .doc(user.id)
      .get();
    const doc = snapshot.data();
    expect(doc.name).to.equal("string");
  });

  it("able to set lowercase values", async () => {
    User.config = {
      toLowercase: true,
    };

    const user = User.init();
    user.name = "STRING-VALUE";
    await user.save();

    const doc = await User.collection.where("name", "==", "String-Value").get();
    expect(doc.name).to.equal("string-value");
  });
});
