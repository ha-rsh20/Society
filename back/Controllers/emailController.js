const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const user = require("../Schema/user");
const otpGenerator = require("./generateOTP");
const dns = require("dns");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// dns.lookup("smtp.gmail.com", { all: true }, console.log);

dotenv.config();

// let transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: process.env.SMTP_SECURE == "true" ? true : false,
//   requireTLS: process.env.SMTP_REQUIRE_TLS == "true" ? true : false,
//   logger: true,
//   debug: true,
//   auth: {
//     user: process.env.SMTP_MAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.SMTP_MAIL,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
  },
});

let otp;

const sendEmail = expressAsyncHandler(async (req, res) => {
  try {
    await transporter.verify((err, success) => {
      if (err) {
        console.error("Error verifying SMTP transporter:", err);
        res.status(500).send();
      } else {
        console.log("SMTP transporter verified successfully");
      }
    });
    console.log("SMTP server is ready");
  } catch (err) {
    console.error(err);
  }

  const mail = process.env.SMTP_MAIL;
  const mail_to = req.params.mail;
  const reset = req.params.reset;
  otp = otpGenerator();

  var mailOptions = {
    from: mail,
    to: mail_to,
    subject:
      reset === undefined
        ? "OTP for email authentication"
        : "OTP to reset password",
    text: `Your OTP is ${otp}`,
  };

  console.log("Sending email to:", mail_to, "with OTP:", otp);

  if (reset !== undefined) {
    console.log("Reset password requested for email:", mail_to);
    user
      .findOne({ email: req.params.mail })
      .then((data) => {
        if (data) {
          console.log("User found for reset:", data.email);
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log("Error sending email in reset:", err);
              res.status(500).send();
            } else {
              res.status(200).send();
              console.log("Reset email sent successfully to:", mail_to);
            }
          });
        } else {
          console.log("No user found for reset with email:", mail_to);
          res.status(204).send();
        }
      })
      .catch((err) => {
        console.log("Error finding user for reset:", err);
        res.sendStatus(500);
      });
  } else {
    console.log("Sending OTP email to:", mail_to);
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("Error sending email:", err);
        res.status(500).send();
      } else {
        res.status(200).send();
        console.log("OTP email sent successfully to:", mail_to);
      }
    });
  }
});

const verifyOTP = (req, res) => {
  console.log("Verifying OTP:", req.body.otp, "against generated OTP:", otp);
  if (req.body.otp === otp) {
    res.status(200).send();
  } else {
    res.status(500).send();
  }
};

module.exports = { sendEmail, verifyOTP };
