const express = require("express");
const router = express.Router();
const response = require("../utils/response");

const home = (req, res) => {
  return response(res, 200, true, "Bem-vindo à API Study Better!", {
    status: "online",
    version: process.env.npm_package_version || "1.0.0",
    env: process.env.NODE_ENV || "development",
    docs: "/docs (em breve)",
  });
};

const health = (req, res) => {
  return response(res, 200, true, "OK", {
    db: "ok", // opcional: substituir por checagem real
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = { home, health };
