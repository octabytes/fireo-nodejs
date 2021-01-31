const { Firestore: CloudFirestore } = require("@google-cloud/firestore");
const firestore = require("../../../Firestore");
const chai = require("chai");

const expect = chai.expect;

describe("Firestore", () => {
  it("should be instance of Cloud firestore", () => {
    expect(firestore instanceof CloudFirestore).to.be.true;
  });
});
