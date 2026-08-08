require("dotenv").config();
const user = require("../Schema/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const logActivity = require("../Util/Logger");

const login = (req, res) => {
  console.log("Login request received for email:", req.body.email);
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
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        logActivity(`----User logged in successfully: ${req.body.email}----`);

        res.status(201).send();
      } else {
        //using error code 203 for invalid password
        logActivity(`----Invalid password for email: ${req.body.email}----`);
        res.status(203).send();
      }
    })
    .catch((err) => {
      //using error code 204 for invalid credential
      logActivity(
        `----Invalid credentials for email: ${req.body.email}, error: ${err}----`,
      );
      res.status(204).send();
      console.log(err);
    });
};

function generateAccessToken(email) {
  logActivity(`----Generating access token for email: ${email}----`);
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
      logActivity(`----Invalid token for email: ${email}, error: ${err}----`);
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
    logActivity("----No token provided during re-login----");
    return res.status(401).send("Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  if (!decoded) {
    logActivity("----Invalid token provided during re-login----");
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
        logActivity(`----User not found for email: ${req.user}----`);
        return res.status(404).send("User not found");
      }
      const accessToken = generateAccessToken(req.user);
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      logActivity(`----Re-login successful for email: ${req.user}----`);
      console.log("Re-login successful. New Access Token:", accessToken);

      res.status(200).send();
    })
    .catch((err) => {
      logActivity(`----Error finding user during re-login: ${err}----`);
      console.log("Error finding user during re-login:", err);
      res.sendStatus(500);
    });
};

const logout = (req, res) => {
  logActivity("----Logout request received----");
  console.log("Logout request received. Clearing token cookie.");
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  logActivity("----User logged out successfully----");
  res.status(200).send("Logged out successfully");
};

module.exports = { login, authenticateToken, reLogin, logout };
