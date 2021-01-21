const Model = require("./Model");
const Field = require("./Field");

class User extends Model {
  name = Field.Text();
}

const user = User.init();
