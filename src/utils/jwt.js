const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

if (!JWT_SECRET) {
  // Fail fast so developers know to set the secret
  throw new Error("JWT_SECRET is not defined in environment variables.");
}

const sign = (payload, options = {}) => {
  const signOptions = { expiresIn: JWT_EXPIRES_IN, ...options };
  return jwt.sign(payload, JWT_SECRET, signOptions);
};

const verify = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // rethrow so callers can decide how to handle (401, 403, etc.)
    throw err;
  }
};

module.exports = { sign, verify };