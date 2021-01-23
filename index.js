const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");

class User extends Model {
  name = Field.Text();
}

const main = async () => {
  // const user = User.init();
  // user.name = "string";
  // await user.save();

  // console.log(user.id);

  const doc = await User.collection.get({ id: "fwP6fPtG7nal0CmiOWy2" });
  console.log(doc);
};

main();
