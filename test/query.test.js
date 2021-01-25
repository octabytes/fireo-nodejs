const Chai = require("chai");
const Model = require("../src/model/Model");
const Fields = require("../src/fields/Field");
const Field = require("../src/fields/Field");
const { DocumentNotFound } = require("../errors");

const expect = Chai.expect;

describe("Query", async () => {
  class User extends Model {
    name = Field.Text();
    age = Fields.Number();
    address = Field.Text({ name: "location" });
  }

  const user = User.init();
  user.name = "name1";
  user.age = 1;
  user.address = "address1";
  await user.save();

  const user = User.init();
  user.name = "name2";
  user.age = 1;
  user.address = "address2";
  await user.save();

  const user = User.init();
  user.name = "name2";
  user.age = 2;
  user.address = "address1";
  await user.save();

  it("should able to filter", async () => {
    const docs = await User.collection.where("name", "==", "name1").fetch();
    expect(docs.length).to.greaterThan(0);
    for (const doc of docs) {
      expect(doc.name).to.equal("name1");
    }
  });

  it("should able to filter with custom field name", async () => {
    const docs = await User.collection
      .where("address", "==", "address1")
      .fetch();
    expect(docs.length).to.greaterThan(0);
    for (const doc of docs) {
      expect(doc.address).to.equal("address1");
    }
  });
  it("should able to get first document from query", async () => {
    const doc = await User.collection.where("age", "==", 1).get();
    expect(doc.key).to.be.not.undefined;
    expect(doc.age).to.equal(1);
  });

  it("should able to all documents", async () => {
    const docs = await User.collection.fetch();
    expect(docs.length).to.greaterThan(2);
  });

  it("should able to limit data", async () => {
    const docs = await User.collection.limit(1).fetch();
    expect(docs.length).to.equal(1);
    expect(docs[0].key).to.be.not.undefined;
  });
  it("should able to limit data in fetch", async () => {
    const docs = await User.collection.fetch(1);
    expect(docs.length).to.equal(1);
    expect(docs[0].key).to.be.not.undefined;
  });
  it("throw error no document found", async () => {
    await expect(
      User.collection.where("name", "==", "not-exist").fetch()
    ).to.be.rejectedWith(DocumentNotFound);
  });
  it("should order the results", async () => {
    const docs = await User.collection
      .where("age", "==", 1)
      .orderBy("age")
      .fetch();
    expect(docs.length).to.greaterThan(0);
    let previousAge = 0;
    for (const doc in docs) {
      expect(doc.age).to.gte(previousAge);
      previousAge = doc.age;
    }
  });
  it("should order the results in descending order", async () => {
    const docs = await User.collection
      .where("age", "==", 1)
      .orderBy("-age")
      .fetch();
    expect(docs.length).to.greaterThan(0);
    let previousAge = 3;
    for (const doc in docs) {
      expect(doc.age).to.lte(previousAge);
      previousAge = doc.age;
    }
  });
});
