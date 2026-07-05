const express = require("express");
require("dotenv").config();
const DBConnect = require("./Config/dbcon");
const memberRoute = require("./Routes/memberRoutes");
const authRoute = require("./Routes/authRoutes");
const isAuthenticated = require("./Middleware/Authenticated");
const cors = require("cors");

const app = express();

//Connect to the Database
DBConnect();

app.use(express.json());
console.log("Cross Origin:", process.env.CROSS_ORIGIN);
//Allow Cors
app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  }),
);

//Routes
app.use("/api", isAuthenticated, memberRoute);
app.use("/auth", authRoute);

//Start the Server
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
