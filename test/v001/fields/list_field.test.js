const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");

const expect = chai.expect;

describe("ListField", () => {
  describe("ListField() set value", () => {
    let listField;
    beforeEach(() => {
      listField = Field.List();
    });
    it("can be set the value", () => {
      listField.setValue([1, 2]);
      expect(listField.getValue).to.deep.equal([1, 2]);
    });

    it("should only accept the Array", () => {
      expect(() => listField.setValue(["value1", "value2"])).to.not.throw();
    });

    it("should not accept other value which are not Array", () => {
      expect(() => listField.setValue({ name: "value" })).to.throw(
        InvalidFieldType
      );
    });
  });

  describe("listField supported options", () => {
    it("should not throw error if required and value set", () => {
      const listField = Field.List({ required: true });
      listField.setValue([1, 2]);
      expect(() => listField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const listField = Field.List({ required: true });
      expect(() => listField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const listField = Field.List({ name: "custom_name" });
      expect(listField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const listField = Field.List({ default: [1, "string"] });
      expect(listField.getValue).to.deep.equal([1, "string"]);
    });
  });
});
