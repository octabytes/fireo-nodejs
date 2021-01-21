const chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const { InstantiateError } = require("../errors");

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
});
