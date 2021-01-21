const chai = require("chai");
const Field = require("../Field");
const TextField = require("../TextField");
const NumberField = require("../NumberField");
const BaseField = require("../BaseField");
const { InvalidFieldType } = require("../errors");

const expect = chai.expect;

describe("Field", () => {
  describe("Field.Text()", () => {
    it("should return the instance of TextField", () => {
      expect(Field.Text() instanceof TextField).to.be.true;
    });
    it("should also be instance of BaseField", () => {
      expect(Field.Text() instanceof BaseField).to.be.true;
    });

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
  });

  describe("Field.Number()", () => {
    it("should return the instance of NumberField", () => {
      expect(Field.Number() instanceof NumberField).to.be.true;
    });
    it("should also be instance of BaseField", () => {
      expect(Field.Number() instanceof BaseField).to.be.true;
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
  });
});
