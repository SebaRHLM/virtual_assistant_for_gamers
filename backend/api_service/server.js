import express from "express";
import cors from "cors";
import { sequelize } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.get("/", (req, res) => res.send("✅ Backend ZeroAI conectado"));

(async () => {
  try {
    // Conectar BD
    await sequelize.authenticate();
    console.log("✅ Conectado a PostgreSQL con Sequelize");

    // Sincronizar tablas
    //await sequelize.sync({ alter: true });
    //console.log("🗃️ Tablas sincronizadas con PostgreSQL");

    // Iniciar servidor Express
    app.listen(process.env.PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`)
    );
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
  }
})();
