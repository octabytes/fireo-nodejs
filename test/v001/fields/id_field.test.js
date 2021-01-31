const Chai = require("chai");
const Model = require("../../../src/model/Model");
const Field = require("../../../src/fields/Field");
const IDField = require("../../../src/fields/IDField");

const expect = Chai.expect;

describe("IDField", () => {
  it("should return instance of IDField", () => {
    expect(Field.ID() instanceof IDField).to.be.true;
  });

  it("meta should contain the information about `id` field", () => {
    class User extends Model {
      id = Field.ID();
    }

    const user = User.init();
    expect(user.__meta.id).to.be.not.undefined;
  });

  it("should contain the name of field", () => {
    class User extends Model {
      userId = Field.ID();
    }
    const user = User.init();
    expect(user.__meta.id.name).to.equal("userId");
  });
});
