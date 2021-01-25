const Chai = require("chai");
const Model = require("../src/model/Model");
const Fields = require("../src/fields/Field");
const Field = require("../src/fields/Field");
const { DocumentNotFound } = require("../errors");

const expect = Chai.expect;

describe("Query", () => {
  class User extends Model {
    name = Field.Text();
    age = Fields.Number();
    address = Field.Text({ name: "location" });
  }

  before(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = User.init();
        user.name = "name1";
        user.age = 1;
        user.address = "address1";
        user.save();

        const user2 = User.init();
        user2.name = "name2";
        user2.age = 1;
        user2.address = "address2";
        user2.save();

        const user3 = User.init();
        user3.name = "name2";
        user3.age = 2;
        user3.address = "address1";
        user3.save();
        resolve();
      }, 200);
    });
  });

  it("should able to filter", async () => {
    const docs = await User.collection.where("name", "==", "name1").fetch();
    expect(docs.length).to.greaterThan(0);
    for (const doc of docs) {
      expect(doc.name).to.equal("name1");
    }
  });

  it("should able to apply multiple filters", async () => {
    const docs = await User.collection
      .where("name", "==", "name2")
      .where("age", "==", 1)
      .fetch();
    expect(docs.length).to.greaterThan(0);
    for (const doc of docs) {
      expect(doc.name).to.equal("name2");
      expect(doc.age).to.equal(1);
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

  it("should able to fetch all documents", async () => {
    const docs = await User.collection.fetch();
    expect(docs.length).to.greaterThan(2);
  });

  it("should able to fetch limited documents", async () => {
    const docs = await User.collection.fetch(2);
    expect(docs.length).to.equal(2);
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
  it("should return the empty array", async () => {
    const docs = await User.collection.where("name", "==", "not-exist").fetch();
    expect(docs.length).to.equal(0);
  });
  it("should order the results", async () => {
    const docs = await User.collection
      .where("age", "==", 1)
      .orderBy("age")
      .fetch();
    expect(docs.length).to.greaterThan(0);
    let previousAge = 0;
    for (const doc of docs) {
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
    for (const doc of docs) {
      expect(doc.age).to.lte(previousAge);
      previousAge = doc.age;
    }
  });
});
