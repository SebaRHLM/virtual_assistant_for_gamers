import { Sequelize } from "sequelize";


/*En este apartado configuramos la base de datos con el ORM sequelize*/

export const sequelize = new Sequelize("zeroai", "postgres", " ", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

// Probar conexión
try {
  await sequelize.authenticate();
  console.log("Conectado a PostgreSQL con Sequelize");
} catch (err) {
  console.error("Error al conectar a PostgreSQL:", err);
}
