const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");
const firestore = require("./Firestore");

class Parent extends Model {
  name = Field.Text();
}

class Child extends Model {
  name = Field.Text();
}

const main = async () => {
  const p = Parent.init();
  p.name = "string";
  await p.save();

  const c = Child.init({ parent: p.key });
  c.name = "string";
  await c.save();

  await Parent.collection.delete({ child: true });
};

main();

// TODO
// other fields array, geo point etc
// Reference field
// Transactions and batch
// array union, increment, server time
// support custom attributes in fields
// delete by query
