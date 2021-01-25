const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");

class User extends Model {
  name = Field.Text();
  age = Field.Number();
}

const main = async () => {
  // const user = User.init();
  // user.name = "string";
  // user.age = 1;
  // await user.save();

  // const user2 = User.init();
  // user2.name = "string";
  // user2.age = 2;
  // await user2.save();

  //await User.collection.where("name", "==", "string").fetch();
  const docs = await User.collection.where("name", "==", "name1").fetch();
  console.log(docs);
};

main();

// const obj = User.collection.where("", "", "");
// console.log(obj);

// const user = User.init();
// const user2 = user.constructor.init();
// console.log(user2);
