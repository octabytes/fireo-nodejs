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
// 1- delete entire collection and all child documents --> Test
// other fields array, geo point etc
// Reference field
// Transactions and batch
// array union, increment, server time
// to lowercase --> Test
// custom collection name --> Test
// query in parent child collection --> Test
// support custom attributes in fields
// able to set lowercase values of model --> Test
// delete by query
