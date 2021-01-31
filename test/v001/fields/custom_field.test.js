const chai = require("chai");
const Model = require("../../../src/model/Model");
const Field = require("../../../src/fields/Field");
const { RequiredField } = require("../../../errors");
const firestore = require("../../../Firestore");
const { DocumentReference } = require("@google-cloud/firestore");
const BaseField = require("../../../src/fields/BaseField");

const expect = chai.expect;

describe("CustomField", () => {
  it("should modify Database value", async () => {
    class WeekDays extends BaseField {
      days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      setValue(value) {
        this.val = this.days[value];
      }
    }

    class User extends Model {
      day = new WeekDays();
    }

    const user = User.init();
    user.day = 0;
    await user.save();

    const doc = await User.collection.get({ key: user.key });
    expect(doc.day).to.equal("Mon");
  });

  it("should able to modify value which is coming from Firestore", async () => {
    class WeekDays extends BaseField {
      days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      setValue(value) {
        this.val = this.days[value];
      }

      async getDBValue() {
        return this.val + "-mod";
      }
    }

    class User extends Model {
      day = new WeekDays();
    }

    const user = User.init();
    user.day = 0;
    await user.save();

    const doc = await User.collection.get({ key: user.key });
    expect(doc.day).to.equal("Mon-mod");
  });

  it("should able to support custom options", async () => {
    class EmailGenerator extends BaseField {
      static fieldOptions = ["prefix", "domain"];

      option_prefix({ optionValue, fieldValue }) {
        return optionValue + "." + fieldValue;
      }

      option_domain({ optionValue, fieldValue }) {
        return fieldValue + "@" + optionValue;
      }
    }

    class User extends Model {
      email = new EmailGenerator({ prefix: "prefix", domain: "example.com" });
    }

    const user = User.init();
    user.email = "my_email";
    await user.save();

    const doc = await User.collection.get({ key: user.key });
    expect(doc.email).to.equal("prefix.my_email@example.com");
  });
});
