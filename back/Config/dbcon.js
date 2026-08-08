const mongoose = require("mongoose");
const logActivity = require("../Util/Logger");
require("dotenv").config();
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const DBConnect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        logActivity("----Connected to MongoDB----");
        console.log("Connected to MongoDB");
      })
      .catch((err) => {
        logActivity(`----Error connecting to MongoDB: ${err}----`);
        console.error("Error connecting to MongoDB:", err);
      });
  } catch (err) {
    logActivity(`----Error connecting to MongoDB: ${err}----`);
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = DBConnect;
