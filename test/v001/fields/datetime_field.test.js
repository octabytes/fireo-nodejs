const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");

const expect = chai.expect;

describe("DateTime", () => {
  describe("dateTime() set value", () => {
    let dateTime;
    beforeEach(() => {
      dateTime = Field.DateTime();
    });
    it("can be set the value", () => {
      const dt = new Date();
      dateTime.setValue(dt);
      expect(dateTime.getValue).to.equal(dt);
    });

    it("should only accept the DateTime", () => {
      expect(() => dateTime.setValue(new Date())).to.not.throw();
    });

    it("should not accept other value which are not DateTime", () => {
      expect(() => dateTime.setValue("string")).to.throw(InvalidFieldType);
    });
  });

  describe("dateTime supported options", () => {
    it("should not throw error if required and value set", () => {
      const dateTime = Field.DateTime({ required: true });
      dateTime.setValue(new Date());
      expect(() => dateTime.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const dateTime = Field.DateTime({ required: true });
      expect(() => dateTime.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const dateTime = Field.DateTime({ name: "custom_name" });
      expect(dateTime.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const dt = new Date();
      const dateTime = Field.DateTime({ default: dt });
      expect(dateTime.getValue).to.equal(dt);
    });
  });

  describe("Custom Options", () => {
    it("should support `auto`", () => {
      const textField = Field.DateTime({ auto: true });
      expect(textField.getValue).to.be.not.undefined;
    });
  });
});
