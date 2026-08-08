const user = require("../Schema/user");
const jwt = require("jsonwebtoken");
const logActivity = require("../Util/Logger");

const isAuthenticated = (req, res, next) => {
  const token = req.headers.cookie?.split("=")[1];

  logActivity(
    `----Checking authentication for user: ${req.headers.cookie}----`,
  );
  // console.log("Token from cookie:", token);

  if (!token) {
    logActivity("----No token provided----");
    return res.status(401).send("Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //console.log("Decoded token:", decoded);

  if (!decoded) {
    logActivity("----Invalid token provided----");
    return res.status(403).send("Forbidden: Invalid token");
  }

  req.user = decoded.email;

  user
    .findOne({ email: req.user })
    .then((data) => {
      if (!data) {
        logActivity(`----User not found for email: ${req.user}----`);
        return res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      logActivity(`----Error finding user: ${err}----`);
      console.log("Error finding user:", err);
      return res.status(500).send("Internal Server Error");
    });

  logActivity(`----User authenticated: ${req.user}----`);
  next();
};

module.exports = isAuthenticated;
