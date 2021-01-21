const chai = require("chai");
const Model = require("../Model");
const Field = require("../Field");
const { InstantiateError: InstantiateError } = require("../errors");
const TextField = require("../TextField");

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
});
