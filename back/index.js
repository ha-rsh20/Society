const express = require("express");
const DBConnect = require("./Config/dbcon");
const memberRoute = require("./Routes/memberRoutes");
const authRoute = require("./Routes/authRoutes");
const isAuthenticated = require("./Middleware/Authenticated");
const cors = require("cors");

const app = express();

//Connect to the Database
DBConnect();

app.use(express.json());
//Allow Cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

//Routes
app.use("/api", isAuthenticated, memberRoute);
app.use("/auth", authRoute);

//Start the Server
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
