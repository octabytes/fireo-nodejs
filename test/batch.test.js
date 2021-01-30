const Chai = require("chai");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const chaiAsPromised = require("chai-as-promised");
const { Fireo } = require("../index");
const { DocumentNotFound } = require("../errors");

const expect = Chai.expect;
Chai.use(chaiAsPromised);

describe("Batch", () => {
  class User extends Model {
    name = Field.Text();
    age = Field.Number();
  }

  it("Save", async () => {
    const batch = Fireo.batch();
    const user = User.init();
    user.name = "string";
    user.age = 1;
    user.save({ batch });

    await batch.commit();

    expect(user.key).to.be.not.undefined;
  });
  it("Upsert", async () => {
    const batch = Fireo.batch();
    const user = User.init();
    user.name = "string";
    user.age = 1;
    user.upsert({ batch });

    await batch.commit();

    expect(user.key).to.be.not.undefined;
  });
  it("Update", async () => {
    const batch = Fireo.batch();
    const user = User.init();
    user.name = "string";
    user.age = 1;
    await user.save();

    user.age = 2;
    user.update({ batch });
    await batch.commit();

    const doc = await User.collection.get({ key: user.key });
    expect(doc.name).to.equal("string");
    expect(doc.age).to.equal(2);
  });

  it("Delete", async () => {
    const batch = Fireo.batch();
    const user = User.init();
    user.name = "string";
    user.age = 1;
    await user.save();

    user.delete({ batch });
    await batch.commit();

    await expect(User.collection.get({ key: user.key })).to.be.rejectedWith(
      DocumentNotFound
    );
  });

  //   it("Delete by Query", async () => {
  //     const batch = Fireo.batch();
  //     const user = User.init();
  //     user.name = "string";
  //     user.age = 1;
  //     await user.save();

  //     User.collection.delete({ key: user.key, batch });
  //     await batch.commit();

  //     await expect(User.collection.get({ key: user.key })).to.be.rejectedWith(
  //       DocumentNotFound
  //     );
  //   });
});
