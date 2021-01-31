const chai = require("chai");
const Model = require("../../../src/model/Model");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");
const { Fireo } = require("../../../index");

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

  describe("Update list", () => {
    class User extends Model {
      names = Field.List();
    }

    it("union", async () => {
      const user = User.init();
      user.names = ["name1", "name2"];
      await user.save();

      user.names = Fireo.listUnion("name3");
      await user.update();

      const doc = await User.collection.get({ key: user.key });
      expect(doc.names.length).to.equal(3);
      expect(doc.names.includes("name3")).to.be.true;
    });

    it("remove", async () => {
      const user = User.init();
      user.names = ["name1", "name2"];
      await user.save();

      user.names = Fireo.listRemove("name2");
      await user.update();

      const doc = await User.collection.get({ key: user.key });
      expect(doc.names.length).to.equal(1);
      expect(doc.names.includes("name2")).to.be.false;
    });
  });
});
