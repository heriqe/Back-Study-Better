// src/app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// Rotas
const publicRoutes = require("./routes/publicRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materiaisRoutes = require("./routes/materiasRoutes");
const planosRoutes = require("./routes/planoRoutes");

// Middlewares
const errorHandler = require("./middlewares/errorHandler");

// Inicializa app
const app = express();

// ----- CORS -----
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));

// ----- Middlewares base -----
app.use(express.json());

// ----- Rotas públicas -----
app.use("/", publicRoutes);

// Test route simples
app.use("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

// ----- Rotas protegidas/API -----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materiais", materiaisRoutes);
app.use("/api/planos", planosRoutes);

// Health check
app.get("/health", (_, res) => res.status(200).send("ok"));

// ----- Middleware global de erros -----
app.use(errorHandler);

// ----- Iniciar servidor -----
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
