const chai = require("chai");
const Field = require("../../../src/fields/Field");
const TextField = require("../../../src/fields/TextField");
const NumberField = require("../../../src/fields/NumberField");
const BaseField = require("../../../src/fields/BaseField");

const expect = chai.expect;

describe("Field", () => {
  describe("Field.Text()", () => {
    it("should return the instance of TextField", () => {
      expect(Field.Text() instanceof TextField).to.be.true;
    });
    it("should also be instance of BaseField", () => {
      expect(Field.Text() instanceof BaseField).to.be.true;
    });
  });

  describe("Field.Number()", () => {
    it("should return the instance of NumberField", () => {
      expect(Field.Number() instanceof NumberField).to.be.true;
    });
    it("should also be instance of BaseField", () => {
      expect(Field.Number() instanceof BaseField).to.be.true;
    });
  });
});
