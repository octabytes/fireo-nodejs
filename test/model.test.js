const chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const { InstantiateError: InstantiateError } = require("../errors");
const TextField = require("../src/fields/TextField");

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
  it("should keep the record of fields", () => {
    const user = User.init();
    expect(user.__meta.fields.name instanceof TextField).to.be.true;
  });
  it("after getting fields record every field should be undefined", () => {
    const user = User.init();
    expect(user.name).to.be.undefined;
  });

  describe("Model -> fields", () => {
    class User extends Model {
      name = Field.Text();
      age = Field.Number();
    }
    it("should have model name", () => {
      const user = User.init();
      expect(user.__meta.fields.name.modelName).to.equal("User");
    });
    it("should be able to set value from model", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await user.save();

      expect(user.__meta.fields.name.val).to.equal("string");
      expect(user.__meta.fields.age.val).to.equal(1);
    });
  });
});
