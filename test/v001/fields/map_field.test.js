const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");

const expect = chai.expect;

describe("mapField", () => {
  describe("mapField() set value", () => {
    let mapField;
    beforeEach(() => {
      mapField = Field.Map();
    });
    it("can be set the value", () => {
      mapField.setValue({ name: "string" });
      expect(mapField.getValue).to.deep.equal({ name: "string" });
    });

    it("should only accept the Object", () => {
      expect(() => mapField.setValue({ name: "string" })).to.not.throw();
    });

    it("should not accept other value which are not Object", () => {
      expect(() => mapField.setValue([1, 2])).to.throw(InvalidFieldType);
    });
  });

  describe("mapField supported options", () => {
    it("should not throw error if required and value set", () => {
      const mapField = Field.Map({ required: true });
      mapField.setValue({ name: "string" });
      expect(() => mapField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const mapField = Field.Map({ required: true });
      expect(() => mapField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const mapField = Field.Map({ name: "custom_name" });
      expect(mapField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const mapField = Field.Map({ default: { name: "string" } });
      expect(mapField.getValue).to.deep.equal({ name: "string" });
    });
  });
});
