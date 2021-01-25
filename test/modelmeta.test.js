const chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const TextField = require("../src/fields/TextField");

const expect = chai.expect;

describe("Meta Model", () => {
  it("should keep the record of collectionName", () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();
    expect(user.__meta.collectionName).to.be.equal("User");
  });
  it("should keep the record of Model Name", () => {
    class User extends Model {
      name = Field.Text();
    }

    const user = User.init();
    expect(user.__meta.modelName).to.be.equal("User");
  });

  describe("Model -> fields", () => {
    class User extends Model {
      name = Field.Text();
      age = Field.Number();
    }
    it("should keep the record of fields", () => {
      const user = User.init();
      expect(user.__meta.fields.name instanceof TextField).to.be.true;
    });
    it("should have model name", () => {
      const user = User.init();
      expect(user.__meta.fields.name.modelName).to.equal("User");
    });
    it("should be able to set value from model", () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      user.__parseField();

      expect(user.__meta.fields.name.val).to.equal("string");
      expect(user.__meta.fields.age.val).to.equal(1);
    });

    it("should contains the custom name and original name", () => {
      class User extends Model {
        name = Field.Text({ name: "custom_name" });
      }

      const user = User.init();
      user.name = "string";
      user.__parseField();

      expect(user.__meta.fields.name.originalName).to.equal("name");
      expect(user.__meta.fields.name.customName).to.equal("custom_name");
    });

    it("should have same name when there is no custom name set", () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      user.__parseField();

      expect(user.__meta.fields.name.name).to.equal("name");
    });

    it("should have same custom name when there is no custom name set", () => {
      class User extends Model {
        name = Field.Text({ name: "custom_name" });
      }

      const user = User.init();
      user.name = "string";
      user.__parseField();

      expect(user.__meta.fields.name.name).to.equal("custom_name");
    });

    it("parse fields", () => {
      class User extends Model {
        name = Field.Text();
        age = Field.Number();
        address = Field.Text({ name: "location" });
      }

      const user = User.init();
      user.name = "string";
      user.age = 1;
      user.address = "user-location";
      user.__parseField();

      expect(user.__meta.parseFields.name).to.equal("string");
      expect(user.__meta.parseFields.age).to.equal(1);
      expect(user.__meta.parseFields.location).to.equal("user-location");
    });
  });
});
