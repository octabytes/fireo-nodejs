const chai = require("chai");
const Field = require("../../../src/fields/Field");
const { InvalidFieldType, RequiredField } = require("../../../errors");
const { Fireo } = require("../../../index");

const expect = chai.expect;

describe("GeoPoint", () => {
  describe("geoPoint() set value", () => {
    let geoPoint;
    beforeEach(() => {
      geoPoint = Field.GeoPoint();
    });
    it("can be set the value", () => {
      const gp = Fireo.GeoPoint(37.422, 122.084);
      geoPoint.setValue(gp);
      expect(geoPoint.getValue).to.equal(gp);
    });

    it("should only accept the geoPoint", () => {
      expect(() =>
        geoPoint.setValue(Fireo.GeoPoint(37.422, 122.084))
      ).to.not.throw();
    });

    it("should not accept other value which are not geoPoint", () => {
      expect(() => geoPoint.setValue("string")).to.throw(InvalidFieldType);
    });
  });

  describe("geoPoint supported options", () => {
    it("should not throw error if required and value set", () => {
      const geoPoint = Field.GeoPoint({ required: true });
      geoPoint.setValue(Fireo.GeoPoint(37.422, 122.084));
      expect(() => geoPoint.getValue).to.not.throw();
    });
    it("should throw error if required and no value set", () => {
      const geoPoint = Field.GeoPoint({ required: true });
      expect(() => geoPoint.getValue).to.throw(RequiredField);
    });
    it("name can be change", () => {
      const geoPoint = Field.GeoPoint({ name: "custom_name" });
      expect(geoPoint.name).to.equal("custom_name");
    });
    it("has a default value", () => {
      const gp = Fireo.GeoPoint(37.422, 122.084);
      const geoPoint = Field.GeoPoint({ default: gp });
      expect(geoPoint.getValue).to.deep.equal(gp);
    });
  });
});
