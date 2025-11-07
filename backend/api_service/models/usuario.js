import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Formato de la tabla usuario del modelo relacional
export const User = sequelize.define(
  "usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rut: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(100),
    },
    comuna: {
      type: DataTypes.STRING(100),
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Contraseña encriptada (bcrypt)",
    },
    rol: {
      type: DataTypes.STRING(20),
      defaultValue: "usuario",
    },
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  }
);
