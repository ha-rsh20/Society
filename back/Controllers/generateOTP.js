const otpGenerator = require("otp-generator");
const logActivity = require("../Util/Logger");

const generateOTP = () => {
  const OTP = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  logActivity(`Generated OTP: ${OTP}`);

  return OTP;
};

module.exports = generateOTP;
