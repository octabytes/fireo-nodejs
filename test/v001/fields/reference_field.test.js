const chai = require("chai");
const Model = require("../../../src/model/Model");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");
const firestore = require("../../../Firestore");
const { DocumentReference } = require("@google-cloud/firestore");

const expect = chai.expect;

describe("ReferenceField", () => {
  describe("ReferenceField() set value", () => {
    let refField;

    beforeEach(() => {
      refField = Field.Reference();
    });

    it("can be able to set value", async () => {
      refField.setValue("User/custom-id");
      expect(refField.getValue).to.deep.equal(firestore.doc("User/custom-id"));
    });
    it("should only accept key value", () => {
      expect(() => refField.setValue("User/custom-id")).to.not.throw();
    });
    it("should not accept value which are not key", () => {
      expect(() => refField.setValue("asd")).to.throw();
    });
  });

  describe("ReferenceField supported options", () => {
    it("should not throw error if required and value set", () => {
      const textField = Field.Reference({ required: true });
      textField.setValue("User/custom-id");
      expect(() => textField.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const textField = Field.Reference({ required: true });
      expect(() => textField.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const textField = Field.Reference({ name: "custom_name" });
      expect(textField.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const textField = Field.Reference({ default: "User/custom-id" });
      expect(textField.getValue).to.equal("User/custom-id");
    });
  });

  describe("Custom Options", () => {
    it("should return doc ref", async () => {
      class Company extends Model {
        department = Field.Text();
      }
      class Employee extends Model {
        name = Field.Text();
        company = Field.Reference();
      }

      const com = Company.init();
      com.department = "dept";
      await com.save();

      const emp = Employee.init();
      emp.name = "emp-name";
      emp.company = com.key;
      await emp.save();

      const doc = await Employee.collection.get({ key: emp.key });
      expect(doc.name).to.equal("emp-name");
      expect(doc.company instanceof DocumentReference);

      const c = await doc.company.get();
      expect(c.department).to.equal("dept");
    });

    it("should support `autoLoad`", async () => {
      class Company extends Model {
        department = Field.Text();
      }
      class Employee extends Model {
        name = Field.Text();
        company = Field.Reference({ autoLoad: true });
      }

      const com = Company.init();
      com.department = "dept";
      await com.save();

      const emp = Employee.init();
      emp.name = "emp-name";
      emp.company = com.key;
      await emp.save();

      const doc = await Employee.collection.get({ key: emp.key });
      //   console.log(doc.company);
      expect(doc.name).to.equal("emp-name");
      expect(doc.company.department).to.equal("dept");
    });

    // it("should support `onLoad`", async () => {
    //   class Company extends Model {
    //     department = Field.Text();
    //   }
    //   class Employee extends Model {
    //     name = Field.Text();
    //     company = Field.Reference({ onLoad: "doSomething" });

    //     doSomething(company) {
    //       this.modifyDepart = company.department + "-mod";
    //     }
    //   }

    //   const com = Company.init();
    //   com.department = "dept";
    //   await com.save();

    //   const emp = Employee.init();
    //   emp.name = "emp-name";
    //   emp.company = com.key;
    //   await emp.save();

    //   const doc = await Employee.collection.get({ key: emp.key });
    //   const c = await doc.company.get();

    //   expect(doc.name).to.equal("emp-name");
    //   expect(c.department).to.equal("dept");
    //   expect(doc.modifyDepart).to.equal("dept-mod");
    // });
  });
});
