import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,
    logging: false,
  }
);

// Probar conexión
try {
  await sequelize.authenticate();
  console.log("Conectado a PostgreSQL con Sequelize");
} catch (err) {
  console.error("Error al conectar a PostgreSQL:", err);
}
