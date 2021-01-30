const firestore = require("./Firestore");
const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");
const { Fireo } = require("./index");

const main = async () => {
  class User extends Model {
    name = Field.Text();
  }

  const res = await Fireo.runTransaction(async (t) => {
    const user = User.init();
    user.name = "string";
    await user.save();

    return user.key;
  });

  console.log(res);
};

main();
