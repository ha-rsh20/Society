const user = require("../Schema/user");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  let users;
  await user
    .findOne({ email: req.body.email })
    .then((data) => {
      users = data;
    })
    .catch((err) => {
      res.sendStatus(500);
      console.log(err);
    });

  if (users.length !== 0) {
    let nPassword = await bcrypt.hash(req.body.password, users.salt);
    let updatepass = { password: nPassword };

    user
      .updateOne({ email: req.body.email }, { $set: updatepass })
      .then(() => {
        res.sendStatus(201);
      })
      .catch((err) => {
        res.sendStatus(500);
        console.log(err);
      });
  }
};

module.exports = { resetPassword };
