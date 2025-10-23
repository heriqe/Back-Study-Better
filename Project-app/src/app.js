const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materiaisRoutes = require("./routes/materiasRoutes");
const planosRoutes = require("./routes/planoRoutes");
app.use(cors({ origin: process.env.FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());

const errorHandler = require("./middlewares/errorHandler");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/materiais", materiaisRoutes);
app.use("/planos", planosRoutes);
app.get('/health', (_, res) => res.status(200).send('ok'));

// Middleware global de erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
