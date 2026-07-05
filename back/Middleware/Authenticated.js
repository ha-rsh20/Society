const user = require("../Schema/user");
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const token = req.headers.cookie?.split("=")[1];

  // console.log("Token from cookie:", token);

  if (!token) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  //console.log("Decoded token:", decoded);

  if (!decoded) {
    return res.status(403).send("Forbidden: Invalid token");
  }

  req.user = decoded.email;

  user
    .findOne({ email: req.user })
    .then((data) => {
      if (!data) {
        return res.status(404).send("User not found");
      }
    })
    .catch((err) => {
      console.log("Error finding user:", err);
      return res.status(500).send("Internal Server Error");
    });

  console.log("User authenticated:", req.user);
  next();
};

module.exports = isAuthenticated;
