const Model = require("./src/model/Model");
const Field = require("./src/fields/Field");
const firestore = require("./Firestore");

class User extends Model {
  name = Field.Text();
  age = Field.Number();
}

const main = async () => {
  // for (let i = 0; i <= 10; i++) {
  //   const user = User.init();
  //   user.name = "name" + i;
  //   user.age = i;
  //   await user.save();
  // }

  const doc = await firestore.doc("User/xeNcpFTYhEgEHFqwlanM").get();
  console.log(doc.data());
};

main();
