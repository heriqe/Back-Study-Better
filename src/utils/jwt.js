const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

if (!JWT_EXPIRES_IN) {
  console.warn("JWT_EXPIRES_IN is not defined. Tokens will not expire.");
}

const sign = (payload, options = {}) => {
  const signOptions = { expiresIn: JWT_EXPIRES_IN, ...options };
  try {
    return jwt.sign(payload, JWT_SECRET, signOptions);
  } catch (err) {
    console.error("JWT signing failed:", err.message);
    throw err;
  }
};

const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    throw err;
  }
};

module.exports = { sign, verify };
