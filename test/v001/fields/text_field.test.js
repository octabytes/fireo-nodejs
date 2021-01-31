const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");

const expect = chai.expect;

describe("TextField", () => {
  describe("TextField() set value", () => {
    let textField;
    beforeEach(() => {
      textField = Field.Text();
    });
    it("can be able to set value", () => {
      textField.setValue("string");
      expect(textField.getValue).to.equal("string");
    });
    it("should only accept string value", () => {
      expect(() => textField.setValue("string")).to.not.throw();
    });
    it("should not accept value which are not string", () => {
      expect(() => textField.setValue(1)).to.throw(InvalidFieldType);
    });
  });

  describe("TextField supported options", () => {
    it("should not throw error if required and value set", () => {
      const textField = Field.Text({ required: true });
      textField.setValue("string");
      expect(() => textField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const textField = Field.Text({ required: true });
      expect(() => textField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const textField = Field.Text({ name: "custom_name" });
      expect(textField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const textField = Field.Text({ default: "string" });
      expect(textField.getValue).to.equal("string");
    });
  });

  describe("Custom Options", () => {
    it("should support toLowercase", () => {
      const textField = Field.Text({ toLowercase: true });
      textField.setValue("STRING");
      expect(textField.getValue).to.equal("string");
    });
    it("should not toLowercase when option is `false`", () => {
      const textField = Field.Text({ toLowercase: false });
      textField.setValue("STRING");
      expect(textField.getValue).to.equal("STRING");
    });
    it("Other options does not effect on custom options", () => {
      const textField = Field.Text({
        toLowercase: true,
        optionNotExist: false,
      });
      textField.setValue("STRING");
      expect(textField.getValue).to.equal("string");
    });
  });
});
