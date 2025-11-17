import express from 'express';
import cors from "cors";
import { sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => res.send("Backend ZeroAI conectado"));

// Inicialización del servidor
(async () => {
  try {
    // Conectar BD
    await sequelize.authenticate();
    console.log("Conectado a PostgreSQL con Sequelize");

    // Sincronizar tablas
    console.log("Iniciando sincronización con PostgreSQL");
    await sequelize.sync({ alter: true });
    console.log("Tablas sincronizadas con PostgreSQL");

    // Iniciar servidor Express
    app.listen(PORT, () =>
      console.log(`🚀 Backend ZeroAI iniciado en el puerto ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
})();
