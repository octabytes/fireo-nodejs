const Chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const Model = require("../src/model/Model");
const Field = require("../src/fields/Field");
const { EmptyDocument, DocumentNotFound, KeyNotExist } = require("../errors");
const { use } = require("chai");

const expect = Chai.expect;
Chai.use(chaiAsPromised);

describe("Firestore Operation", () => {
  //#################################
  //######### ID FIELD() #############
  //#################################
  describe("Model -> IDField", () => {
    it("should able to set custom id", async () => {
      class User extends Model {
        id = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.id = "custom-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: "custom-id" });
      expect(doc.id).to.equal("custom-id");
      expect(doc.name).to.equal("string");
    });

    it("should able to change the id field name", async () => {
      class User extends Model {
        userId = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.userId = "custom-user-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: "custom-user-id" });
      expect(doc.userId).to.equal("custom-user-id");
      expect(doc.name).to.equal("string");
    });

    it("should generate `id` automatically if value not provided", async () => {
      class User extends Model {
        id = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.id });
      expect(doc.id).to.equal(user.id);
      expect(doc.name).to.equal("string");
    });
  });

  //#################################
  //######### SAVE() ################
  //#################################

  describe("Save()", () => {
    let user;
    beforeEach(() => {
      class User extends Model {
        name = Field.Text();
      }

      user = User.init();
    });

    it("should save data", async () => {
      user.name = "string";
      await user.save();
    });
    it("should not save the empty document", async () => {
      await expect(user.save()).to.be.rejectedWith(EmptyDocument);
    });
    it("should return `id` in model", async () => {
      user.name = "string";
      await user.save();

      expect(user.id).to.be.not.undefined;
    });
    it("should return `key` in model", async () => {
      user.name = "string";
      await user.save();

      expect(user.key).to.be.not.undefined;
    });

    it("should able to save zero in Number Field", async () => {
      class User extends Model {
        name = Field.Text();
        age = Field.Number();
      }
      const user = User.init();
      user.name = "string";
      user.age = 0;
      await user.save();

      const doc = await User.collection.get({ key: user.key });
      expect(doc.name).to.equal("string");
      expect(doc.age).to.equal(0);
    });
  });

  //#################################
  //######### UPSERT() ##############
  //#################################

  describe("Upsert()", () => {
    it("should add document if not exist", async () => {
      class User extends Model {
        name = Field.Text();
        age = Field.Number();
      }

      const user = User.init();
      user.name = "string";
      user.age = 1;
      await user.upsert();

      expect(user.id).to.be.not.undefined;
      expect(user.key).to.be.not.undefined;
    });
    it("should merge document if exist", async () => {
      class User extends Model {
        id = Field.ID();
        name = Field.Text();
        age = Field.Number();
      }

      const user = User.init();
      user.id = "upsert-custom-id";
      user.name = "string";
      await user.save();

      const userUpdate = User.init();
      userUpdate.id = "upsert-custom-id";
      userUpdate.age = 1;
      await userUpdate.upsert();

      const doc = await User.collection.get({ id: "upsert-custom-id" });
      expect(doc.name).to.equal("string");
      expect(doc.age).to.equal(1);
    });
  });

  //#################################
  //######### GET() #################
  //#################################

  describe("Get()", () => {
    it("should return instance of model", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.id });
      expect(doc instanceof User).to.be.true;
      expect(doc.id).to.be.not.undefined;
      expect(doc.key).to.be.not.undefined;
    });

    it("should able to get data with id", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.id });
      expect(doc.id).to.equal(user.id);
      expect(doc.name).to.equal("string");
    });
    it("should able to get data with custom id", async () => {
      class User extends Model {
        userId = Field.ID();
        name = Field.Text();
      }

      const user = User.init();
      user.userId = "some-custom-id";
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ id: user.userId });
      expect(doc.userId).to.equal(user.userId);
      expect(doc.name).to.equal("string");
    });
    it("should able to get data with key", async () => {
      class User extends Model {
        name = Field.Text();
      }

      const user = User.init();
      user.name = "string";
      await user.save();

      const doc = await User.collection.get({ key: user.key });
      expect(doc.userId).to.equal(user.userId);
      expect(doc.key).to.equal(user.key);
      expect(doc.name).to.equal("string");
    });
  });

  //#################################
  //######### UPSERT() ##############
  //#################################

  describe("Update()", () => {
    class User extends Model {
      name = Field.Text();
      age = Field.Number();
    }

    it("should update the existing document", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await user.save();

      user.name = "updated-name";
      await user.update();

      const doc = await User.collection.get({ id: user.id });
      expect(doc.name).to.equal("updated-name");
      expect(doc.age).to.equal(1);
    });
    it("throw error if document key not exists and not provided in `update()`", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await expect(user.update()).to.be.rejectedWith(KeyNotExist);
    });
    it("throw error if document not exists", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await expect(
        user.update({ id: "id-should-not-exist" })
      ).to.be.rejectedWith(DocumentNotFound);
    });
    it("update document through `id`", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await user.save();

      const updateUser = User.init();
      updateUser.name = "updated-name";
      await updateUser.update({ id: user.id });
    });
    it("update document through `key`", async () => {
      const user = User.init();
      user.name = "string";
      user.age = 1;
      await user.save();

      const updateUser = User.init();
      updateUser.name = "updated-name";
      await updateUser.update({ key: user.key });
    });
  });

  //#################################
  //######### DELETE() ##############
  //#################################

  describe("Delete()", () => {
    class User extends Model {
      name = Field.Text();
    }

    it("should be called from model object", async () => {
      const user = User.init();
      user.name = "string";
      await user.save();

      await user.delete();

      await expect(User.collection.get({ key: user.key })).to.be.rejectedWith(
        DocumentNotFound
      );
    });

    it("throw error if key not defined", async () => {
      const user = User.init();
      user.name = "string";

      await expect(user.delete()).to.be.rejectedWith(KeyNotExist);
    });

    it("should able to call it from `collection`", async () => {
      const user = User.init();
      user.name = "string";
      await user.save();

      await User.collection.delete({ key: user.key });

      await expect(User.collection.get({ key: user.key })).to.be.rejectedWith(
        DocumentNotFound
      );
    });

    it("delete using `id` from `collection`", async () => {
      const user = User.init();
      user.name = "string";
      await user.save();

      await User.collection.delete({ id: user.id });

      await expect(User.collection.get({ key: user.key })).to.be.rejectedWith(
        DocumentNotFound
      );
    });
  });
});
