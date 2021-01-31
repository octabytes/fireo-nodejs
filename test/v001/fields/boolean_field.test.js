const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");

const expect = chai.expect;

describe("BooleanField", () => {
  describe("BooleanField() set value", () => {
    let booleanField;
    beforeEach(() => {
      booleanField = Field.Boolean();
    });
    it("can be set the value", () => {
      booleanField.setValue(true);
      expect(booleanField.getValue).to.be.true;
    });

    it("should only accept the Boolean", () => {
      expect(() => booleanField.setValue(true)).to.not.throw();
    });

    it("should not accept other value which are not Boolean", () => {
      expect(() => booleanField.setValue(0)).to.throw(InvalidFieldType);
    });
  });

  describe("BooleanField supported options", () => {
    it("should not throw error if required and value set", () => {
      const booleanField = Field.Boolean({ required: true });
      booleanField.setValue(true);
      expect(() => booleanField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const booleanField = Field.Boolean({ required: true });
      expect(() => booleanField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const booleanField = Field.Boolean({ name: "custom_name" });
      expect(booleanField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const booleanField = Field.Boolean({ default: false });
      expect(booleanField.getValue).to.equal(false);
    });
  });
});
