const Member = require("../Schema/member");
const logActivity = require("../Util/Logger");

const getOneMember = async (req, res) => {
  await Member.findById(req.params.id)
    .then((member) => {
      logActivity(`----Member found: ${member}----`);
      res.status(200).json(member);
    })
    .catch((err) => {
      logActivity(`----Error finding member: ${err}----`);
      console.log("Trying to find member: " + err);
      res.status(500).json({ message: err.message });
    });
};

const getMembers = async (req, res) => {
  await Member.find()
    .then((member) => {
      logActivity(`----Members found: ${member}----`);
      res.status(200).send(member);
    })
    .catch((err) => {
      logActivity(`----Error finding members: ${err}----`);
      console.log("Trying to find members: " + err);
      res.status(500).send({ message: err.message });
    });
};

const addMember = async (req, res) => {
  const { homeNumber, memberName, maintenance } = req.body;
  const member = new Member({ homeNumber, memberName, maintenance });

  console.log(member);
  await member
    .save()
    .then((member) => {
      logActivity(`----Member added: ${member}----`);
      res.status(201).json(member);
    })
    .catch((err) => {
      logActivity(`----Error adding member: ${err}----`);
      console.log("Trying to add member: " + err);
      res.status(500).json({ message: err.message });
    });
};

const updateMember = async (req, res) => {
  const { homeNumber, memberName, maintenance } = req.body;

  const updatedMember = { homeNumber, memberName, maintenance };

  const member = await Member.updateOne(
    { homeNumber: req.params.id },
    { $set: updatedMember },
  )
    .then((member) => {
      logActivity(`----Member updated: ${member}----`);
      res.status(201).json(member);
    })
    .catch((err) => {
      logActivity(`----Error updating member: ${err}----`);
      console.log("Trying to update member: " + err);
      res.status(500).json({ message: err.message });
    });
};

const deleteMember = async (req, res) => {
  await Member.deleteOne({ homeNumber: req.params.id })
    .then(() => {
      logActivity(`----Member deleted: ${req.params.id}----`);
      res.status(200).json({ message: "Member deleted successfully" });
    })
    .catch((err) => {
      logActivity(`----Error deleting member: ${err}----`);
      console.log("Trying to delete member: " + err);
      res.status(500).json({ message: err.message });
    });
};

module.exports = {
  getOneMember,
  getMembers,
  addMember,
  updateMember,
  deleteMember,
};
