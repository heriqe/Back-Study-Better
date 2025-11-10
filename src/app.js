// src/app.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

// rotas e middlewares
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materiaisRoutes = require("./routes/materiasRoutes");
const planosRoutes = require("./routes/planoRoutes");
const errorHandler = require("./middlewares/errorHandler");
const publicRoutes = require("./routes/publicRoutes");

const app = express();

// configuração CORS: usa FRONTEND_ORIGIN se definido, senão permite localhost do Vite
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));

// Rotas
app.use("/", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/materiais", materiaisRoutes);
app.use("/api/planos", planosRoutes);
app.get("/health", (_, res) => res.status(200).send("ok"));


// Middleware global de erros (deve vir depois das rotas)
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
