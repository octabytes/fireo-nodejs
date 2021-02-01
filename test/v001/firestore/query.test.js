const Chai = require("chai");
const Model = require("../../../src/model/Model");
const Fields = require("../../../src/fields/Field");
const Field = require("../../../src/fields/Field");
const { Fireo } = require("../../../index");

const expect = Chai.expect;

describe("Query", () => {
  class User extends Model {
    name = Field.Text();
    age = Fields.Number();
    address = Field.Text({ name: "location" });
  }

  before(() => {
    Fireo.connection.setting({ projectId: "fs-test-project" });

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
      }, 500);
    });
  });

  it("should able to filter", async () => {
    const docs = await User.collection.where("name", "==", "name1").fetch();
    expect(docs.list.length).to.greaterThan(0);
    for (const doc of docs.list) {
      expect(doc.name).to.equal("name1");
    }
  });

  it("should able to apply multiple filters", async () => {
    const docs = await User.collection
      .where("name", "==", "name2")
      .where("age", "==", 1)
      .fetch();
    expect(docs.list.length).to.greaterThan(0);
    for (const doc of docs.list) {
      expect(doc.name).to.equal("name2");
      expect(doc.age).to.equal(1);
    }
  });

  it("should able to filter with custom field name", async () => {
    const docs = await User.collection
      .where("address", "==", "address1")
      .fetch();
    expect(docs.list.length).to.greaterThan(0);
    for (const doc of docs.list) {
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
    expect(docs.list.length).to.greaterThan(2);
  });

  it("should able to fetch limited documents", async () => {
    const docs = await User.collection.fetch(2);
    expect(docs.list.length).to.equal(2);
  });

  it("should able to limit data", async () => {
    const docs = await User.collection.limit(1).fetch();
    expect(docs.list.length).to.equal(1);
    expect(docs.list[0].key).to.be.not.undefined;
  });
  it("should able to limit data in fetch", async () => {
    const docs = await User.collection.fetch(1);
    expect(docs.list.length).to.equal(1);
    expect(docs.list[0].key).to.be.not.undefined;
  });
  it("should able to order the collection", async () => {
    const docs = await User.collection.orderBy("age").fetch(1);
    expect(docs.list.length).to.greaterThan(0);
    let previousAge = 0;
    for (const doc of docs.list) {
      expect(doc.age).to.gte(previousAge);
      previousAge = doc.age;
    }
  });
  it("should return the empty array", async () => {
    const docs = await User.collection.where("name", "==", "not-exist").fetch();
    expect(docs.list.length).to.equal(0);
  });
  it("should order the results", async () => {
    const docs = await User.collection
      .where("age", "==", 1)
      .orderBy("age")
      .fetch();
    expect(docs.list.length).to.greaterThan(0);
    let previousAge = 0;
    for (const doc of docs.list) {
      expect(doc.age).to.gte(previousAge);
      previousAge = doc.age;
    }
  });
  it("should order the results in descending order", async () => {
    const docs = await User.collection
      .where("age", "==", 1)
      .orderBy("-age")
      .fetch();
    expect(docs.list.length).to.greaterThan(0);
    let previousAge = 3;
    for (const doc of docs.list) {
      expect(doc.age).to.lte(previousAge);
      previousAge = doc.age;
    }
  });

  it("should able to offset data", async () => {
    class UserOffset extends Model {
      age = Field.Number();
    }
    for (let i = 1; i < 10; i++) {
      const u = UserOffset.init();
      u.age = new Date().getTime();
      await u.save();
    }

    const firstList = await UserOffset.collection.orderBy("age").fetch(3);
    const lastQueryAge = firstList.list[2].age;

    const secondList = await UserOffset.collection
      .orderBy("age")
      .offset(3)
      .fetch(3);
    expect(secondList.list[1].age).to.greaterThan(lastQueryAge);
  });

  describe("Cursor", () => {
    class UserCursor extends Model {
      name = Field.Text();
      age = Field.Number();
      address = Field.Text({ name: "location" });
    }

    before(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          for (let i = 1; i < 10; i++) {
            const u = UserCursor.init();
            u.name = "name" + i;
            u.address = "address";
            u.age = new Date().getTime();
            u.save();
          }

          resolve();
        }, 200);
      });
    });

    it("should able to create query cursor", async () => {
      const query = await UserCursor.collection
        .where("address", "==", "address")
        .orderBy("age")
        .limit(3)
        .fetch();
      expect(query.cursor).to.be.not.undefined;

      const nextQuery = await UserCursor.collection
        .cursor(query.cursor)
        .fetch();
      expect(nextQuery.list.length).to.equal(3);
    });

    it("should able to modify the limit of query cursor", async () => {
      const query = await UserCursor.collection
        .where("address", "==", "address")
        .orderBy("age")
        .limit(3)
        .fetch();

      const nextQuery = await UserCursor.collection
        .cursor(query.cursor)
        .fetch(4);
      expect(nextQuery.list.length).to.equal(4);
    });

    it("should able to query in child collections", async () => {
      class User extends Model {
        name = Field.Text();
      }
      class Address extends Model {
        location = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const address = Address.init({ parent: user.key });
      address.location = "user-location";
      await address.save();

      const doc = await Address.collection
        .parent(user.key)
        .where("location", "==", "user-location")
        .fetch(1);
      expect(doc.list[0].location).to.equal("user-location");
    });
  });
});
