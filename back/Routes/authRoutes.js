const express = require("express");
const router = express.Router();

const { login } = require("../Controllers/loginController");
const { authenticateToken } = require("../Controllers/loginController");
const { reLogin } = require("../Controllers/loginController");
const { register } = require("../Controllers/registerController");
const { posts } = require("../Controllers/registerController");
const { sendEmail } = require("../Controllers/emailController");
const { verifyOTP } = require("../Controllers/emailController");
const { resetPassword } = require("../Controllers/passwordResetController");
const { logout } = require("../Controllers/loginController");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/me").get(reLogin);
router.route("/logout").post(logout);

router.route("/sendMail/:mail").get(sendEmail);
router.route("/sendMail/:mail/:reset").get(sendEmail);
router.route("/verifyOTP").post(verifyOTP);
router.route("/password/reset").put(resetPassword);
//route post is just to demonstrate authentication of access token
router.route("/post").post(authenticateToken, posts);

module.exports = router;
