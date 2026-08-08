const expressAsyncHandler = require("express-async-handler");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const user = require("../Schema/user");
const otpGenerator = require("./generateOTP");
const dns = require("dns");
const { gmail } = require("@googleapis/gmail");
const { OAuth2Client } = require("google-auth-library");
const logActivity = require("../Util/Logger");

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

// let transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.SMTP_MAIL,
//     clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
//     clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
//   },
// });

const oAuth2Client = new OAuth2Client(
  process.env.GMAIL_OAUTH_CLIENT_ID,
  process.env.GMAIL_OAUTH_CLIENT_SECRET,
  "https://google.com", // Redirect URI used in setup
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
});

let otp;

const makeBody = (to, from, subject, message) => {
  const str = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=utf-8",
    "",
    message,
  ].join("\n");

  // Gmail API requires the email string to be base64url encoded
  return Buffer.from(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const sendEmail = expressAsyncHandler(async (req, res) => {
  const gmailClient = gmail({ version: "v1", auth: oAuth2Client });
  // try {
  //   await transporter.verify((err, success) => {
  //     if (err) {
  //       console.error("Error verifying SMTP transporter:", err);
  //       res.status(500).send();
  //     } else {
  //       console.log("SMTP transporter verified successfully");
  //     }
  //   });
  //   console.log("SMTP server is ready");
  // } catch (err) {
  //   console.error(err);
  // }

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

  const rawMessage = makeBody(
    mail_to, // Target recipient
    process.env.SMTP_MAIL, // Your authenticated Gmail account
    reset === undefined
      ? "OTP for email authentication"
      : "OTP to reset password", // Email Subject
    `Your OTP is ${otp}`,
  );

  console.log("Sending email to:", mail_to, "with OTP:", otp);

  if (reset !== undefined) {
    console.log("Reset password requested for email:", mail_to);
    user
      .findOne({ email: req.params.mail })
      .then(async (data) => {
        if (data) {
          console.log("User found for reset:", data.email);
          // transporter.sendMail(mailOptions, (err, info) => {
          //   if (err) {
          //     console.log("Error sending email in reset:", err);
          //     res.status(500).send();
          //   } else {
          //     res.status(200).send();
          //     console.log("Reset email sent successfully to:", mail_to);
          //   }
          // });
          try {
            const response = await gmailClient.users.messages.send({
              userId: "me",
              requestBody: {
                raw: rawMessage,
              },
            });
            console.log(
              "Email sent successfully! Message ID:",
              response.data.id,
            );
            logActivity(
              `----Reset email sent successfully to: ${mail_to} with OTP: ${otp}----`,
            );
            res.status(200).send();
          } catch (error) {
            console.error("Failed to send email via Gmail API:", error);
            logActivity(
              `----Failed to send reset email to: ${mail_to} with error: ${error}----`,
            );
            throw error;
          }
        } else {
          console.log("No user found for reset with email:", mail_to);
          logActivity(`----No user found for reset with email: ${mail_to}----`);
          res.status(204).send();
        }
      })
      .catch((err) => {
        logActivity(
          `----Error finding user for reset with email: ${mail_to}, error: ${err}----`,
        );
        console.log("Error finding user for reset:", err);
        res.sendStatus(500);
      });
  } else {
    console.log("Sending OTP email to:", mail_to);
    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.log("Error sending email:", err);
    //     res.status(500).send();
    //   } else {
    //     res.status(200).send();
    //     console.log("OTP email sent successfully to:", mail_to);
    //   }
    // });
    try {
      const response = await gmailClient.users.messages.send({
        userId: "me",
        requestBody: {
          raw: rawMessage,
        },
      });
      logActivity(
        `----OTP email sent successfully to: ${mail_to} with OTP: ${otp}----`,
      );
      console.log("Email sent successfully! Message ID:", response.data.id);
      res.status(200).send();
    } catch (error) {
      console.error("Failed to send email via Gmail API:", error);
      logActivity(
        `----Failed to send OTP email to: ${mail_to} with error: ${error}----`,
      );
      throw error;
    }
  }
});

const verifyOTP = (req, res) => {
  console.log("Verifying OTP:", req.body.otp, "against generated OTP:", otp);
  if (req.body.otp === otp) {
    logActivity(
      `----OTP verified successfully for email: ${req.params.mail}----`,
    );
    res.status(200).send();
  } else {
    logActivity(
      `----Failed to verify OTP for email: ${req.params.mail}, provided OTP: ${req.body.otp}, generated OTP: ${otp}----`,
    );
    res.status(500).send();
  }
};

module.exports = { sendEmail, verifyOTP };
