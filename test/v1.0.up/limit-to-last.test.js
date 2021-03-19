const Chai = require("chai");
const Field = require("../../src/fields/Field");
const Model = require("../../src/model/Model");

const expect = Chai.expect;

describe("Limit To Last", () => {
  class LimitModel extends Model {
    number = Field.Number();
    collection_number = Field.Number();
    content = Field.Text();
  }
  it("should able to limit docs in reverse order", async () => {
    for (let i = 0; i <= 5; i++) {
      const doc = LimitModel.init();
      doc.number = i;
      doc.collection_number = 1;
      doc.content = "content " + i;
      await doc.save();
    }

    const docs = await LimitModel.collection
      .where("collection_number", "==", 1)
      .orderBy("number")
      .limitToLast(3)
      .fetch();

    expect(docs.list.length).to.equal(3);
    expect(docs.list[0].number).to.equal(3);
  });
});
