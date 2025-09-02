const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const materiaisRoutes = require("./routes/materiasRoutes");
const planosRoutes = require("./routes/planoRoutes");

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

// Middleware global de erros
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
