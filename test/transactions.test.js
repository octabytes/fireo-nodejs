const Chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const chaiAsPromised = require("chai-as-promised");
const { Fireo } = require("../index");
const { DocumentNotFound } = require("../errors");

const expect = Chai.expect;
Chai.use(chaiAsPromised);

describe("Transactions", async () => {
  class User extends Model {
    name = Field.Text();
  }
  it("Get", async () => {
    const user = User.init();
    user.name = "string";
    await user.save();

    const userKey = user.key;
    const name = await Fireo.runTransaction(async (t) => {
      const doc = await User.collection.get({ key: userKey, transaction: t });
      return doc.name;
    });
    expect(name).to.equal("string");
  });
  it("Save", async () => {
    const userKey = await Fireo.runTransaction(async (t) => {
      const user = User.init();
      user.name = "string";
      await user.save({ transaction: t });
      return user.key;
    });
    const doc = await User.collection.get({ key: userKey });
    expect(doc.name).to.equal("string");
  });

  it("Upsert", async () => {
    const userKey = await Fireo.runTransaction(async (t) => {
      const user = User.init();
      user.name = "string";
      await user.upsert({ transaction: t });
      return user.key;
    });
    const doc = await User.collection.get({ key: userKey });
    expect(doc.name).to.equal("string");
  });
  it("Delete", async () => {
    const userKey = await Fireo.runTransaction(async (t) => {
      const user = User.init();
      user.name = "string";
      await user.save({ transaction: t });

      await user.delete({ transaction: t });
      return user.key;
    });

    await expect(User.collection.get({ key: userKey })).to.be.rejectedWith(
      DocumentNotFound
    );
  });

  it("Update", async () => {
    const user = User.init();
    user.name = "string";
    await user.save();

    const userKey = await Fireo.runTransaction(async (t) => {
      user.name = "updated-string";
      await user.update({ transaction: t });

      return user.key;
    });

    const doc = await User.collection.get({ key: userKey });
    expect(doc.name).to.equal("updated-string");
  });

  it("Combine operations", async () => {
    const user = User.init();
    user.name = "string";
    await user.save();
    const userKey = user.key;

    const docKey = await Fireo.runTransaction(async (t) => {
      const doc = await User.collection.get({ key: userKey, transaction: t });
      expect(doc.key).to.equal(userKey);

      const user = User.init();
      user.name = "string";
      await user.save({ transaction: t });
      await user.delete({ transaction: t });

      return user.key;
    });

    await expect(User.collection.get({ key: docKey })).to.be.rejectedWith(
      DocumentNotFound
    );
  });
});
