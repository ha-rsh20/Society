const user = require("../Schema/user");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  let users;
  let error = false;

  await user
    .find()
    .then((data) => {
      users = data;
    })
    .catch((err) => {
      console.log(err);
    });

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === req.body.email) {
      error = true;
    }
  }

  if (error) {
    //using code 202 for error user already registered
    logActivity(
      `----User already registered with email: ${req.body.email}----`,
    );
    res.sendStatus(202);
  } else {
    let newUserId = users.length === 0 ? 1 : users[users.length - 1].id + 1;
    //generating salt for additional security
    let salt = await bcrypt.genSalt(10);
    //generating hash of the plain password
    let sPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new user({
      id: newUserId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: sPassword,
      salt: salt,
    });

    newUser
      .save()
      .then(() => {
        logActivity(
          `----New user registered with email: ${req.body.email}----`,
        );
        res.status(200).send();
      })
      .catch((err) => {
        logActivity(`----Error registering user: ${err}----`);
        res.status(500).send();
        console.log(err);
      });
  }
};

//method posts just for demonstration purpose
const posts = (req, res) => {
  user
    .findOne({ email: res.locals.email })
    .then((data) => {
      logActivity(`----User ${res.locals.email} accessed posts----`);
      res.status(201).send(data);
    })
    .catch((err) => {
      logActivity(
        `----Error accessing posts for user: ${res.locals.email}, error: ${err}----`,
      );
      res.status(501).send();
      console.log(err);
    });
  //res.json();
};

module.exports = { register, posts };
