const Chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");

const expect = Chai.expect;

describe("Firestore Operation", () => {
  describe("Model -> IDField", () => {
    it("should able to set custom id", async () => {
      class User extends Model {
        id = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.id = "custom-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: "custom-id" });
      expect(doc.id).to.equal("custom-id");
      expect(doc.name).to.equal("string");
    });

    it("should able to change the id field name", async () => {
      class User extends Model {
        userId = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.userId = "custom-user-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: "custom-user-id" });
      expect(doc.userId).to.equal("custom-user-id");
      expect(doc.name).to.equal("string");
    });
  });
  describe("Save()", () => {
    let user;
    beforeEach(() => {
      class User extends Model {
        name = Field.Text();
      }

      user = User.init();
    });

    it("should save data", async () => {
      user.name = "string";
      await user.save();
    });
    it("should not save the empty document", () => {});
    it("should return `id` in model", async () => {
      user.name = "string";
      await user.save();

      expect(user.id).to.be.not.undefined;
    });
    it("should return `key` in model", async () => {
      user.name = "string";
      await user.save();

      expect(user.key).to.be.not.undefined;
    });
  });

  describe("Get()", () => {
    it("should return instance of model", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.id });
      expect(doc instanceof User).to.be.true;
      expect(doc.id).to.be.not.undefined;
      expect(doc.key).to.be.not.undefined;
    });

    it("should able to get data with id", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.id });
      expect(doc.id).to.equal(user.id);
      expect(doc.name).to.equal("string");
    });
    it("should able to get data with custom id", async () => {
      class User extends Model {
        userId = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.userId = "some-custom-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.userId });
      expect(doc.userId).to.equal(user.userId);
      expect(doc.name).to.equal("string");
    });
    it("should able to get data with key", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ key: user.key });
      expect(doc.userId).to.equal(user.userId);
      expect(doc.key).to.equal(user.key);
      expect(doc.name).to.equal("string");
    });
  });
});
