const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  homeNumber: { type: Number, required: true },
  memberName: { type: String, required: true },
  maintenance: { type: Boolean, default: false },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
