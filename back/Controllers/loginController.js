require("dotenv").config();
const user = require("../Schema/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = (req, res) => {
  //console.log("Login request received for email:", req.body.email);
  user
    .findOne({ email: req.body.email })
    .then(async (data) => {
      // console.log("User found:", data);
      let user = data;
      //hashing the plain password for authentication
      let sPassword = await bcrypt.hash(req.body.password, user.salt);
      if (user.password === sPassword) {
        const accessToken = generateAccessToken(req.body.email);
        const refreshToken = jwt.sign(
          req.body.email,
          process.env.REFRESH_TOKEN_SECRET,
        );
        // console.log(
        //   "Login successful. Access Token:",
        //   accessToken,
        //   "Refresh Token:",
        //   refreshToken,
        // );
        res.cookie("token", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).send();
      } else {
        //using error code 203 for invalid password
        res.status(203).send();
      }
    })
    .catch((err) => {
      //using error code 204 for invalid credential
      res.status(204).send();
      console.log(err);
    });
};

function generateAccessToken(email) {
  return jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "24h",
  });
}

function authenticateToken(req, res, next) {
  const authHeader = req.body.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
    if (err) {
      res.sendStatus(403);
    }
    //req.email = email;
    res.locals.email = email.email;
    next();
  });
}

const reLogin = (req, res) => {
  const token = req.headers.cookie?.split("=")[1];

  console.log("Re-login request received. Token from cookie:", token);

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    return res.status(403).send("Forbidden: Invalid token");
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  req.user = decoded.email;

  user
    .findOne({ email: req.user })
    .then((data) => {
      // console.log("User found during re-login:", data);
      if (!data) {
        return res.status(404).send("User not found");
      }
      const accessToken = generateAccessToken(req.user);
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("Re-login successful. New Access Token:", accessToken);

      res.status(200).send();
    })
    .catch((err) => {
      console.log("Error finding user during re-login:", err);
      res.sendStatus(500);
    });
};

const logout = (req, res) => {
  console.log("Logout request received. Clearing token cookie.");
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).send("Logged out successfully");
};

module.exports = { login, authenticateToken, reLogin, logout };
