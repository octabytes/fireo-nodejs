const chai = require("chai");
const Model = require("../../../src/model/Model");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");
const { Fireo } = require("../../../index");

const expect = chai.expect;

describe("NumberField", () => {
  it("Increment", async () => {
    class User extends Model {
      age = Field.Number();
    }

    const user = User.init();
    user.age = 1;
    await user.save();

    user.age = Fireo.increment(10);
    await user.update();

    const doc = await User.collection.get({ key: user.key });
    expect(doc.age).to.equal(11);
  });
  describe("NumberField() set value", () => {
    let numberField;
    beforeEach(() => {
      numberField = Field.Number();
    });
    it("can be set the value", () => {
      numberField.setValue(1);
      expect(numberField.getValue).to.equal(1);
    });

    it("should only accept the Number", () => {
      expect(() => numberField.setValue(1)).to.not.throw();
    });

    it("should not accept other value which are not Number", () => {
      expect(() => numberField.setValue("string")).to.throw(InvalidFieldType);
    });
  });

  describe("NumberField supported options", () => {
    it("should not throw error if required and value set", () => {
      const numberField = Field.Number({ required: true });
      numberField.setValue(1);
      expect(() => numberField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const numberField = Field.Number({ required: true });
      expect(() => numberField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const numberField = Field.Number({ name: "custom_name" });
      expect(numberField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const numberField = Field.Number({ default: 1 });
      expect(numberField.getValue).to.equal(1);
    });
  });
});
