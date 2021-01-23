const Chai = require("chai");
const Model = require("../src/model/Model");
const Fields = require("../src/fields/Field");

const expect = Chai.expect;

describe("Sub Collection", () => {
  class User extends Model {
    name = Fields.Text();
  }
  class Address extends Model {
    city = Fields.Text();
  }
  it("should able to save and get data", async () => {
    const user = User.init();
    user.name = "string";
    await user.save();

    const address = Address.init({ parent: user.key });
    address.city = "city";
    await address.save();

    const doc = await Address.collection.get({ key: address.key });
    expect(doc.city).to.equal("city");
  });
  it("should able to save and get data with custom `id`", async () => {
    const user = User.init();
    user.id = "custom-id-field";
    user.name = "string";
    await user.save();

    const address = Address.init({ parent: user.key });
    address.id = "custom-address-id";
    address.city = "city";
    await address.save();

    const doc = await Address.collection.get({ key: address.key });
    expect(doc.city).to.equal("city");
  });
});
