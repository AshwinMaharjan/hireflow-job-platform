const crypto = require("crypto");

const generateVerificationToken = () => {
    const token = crypto.randomBytes(32).toString("hex");

    return token;
};

module.exports = generateVerificationToken;