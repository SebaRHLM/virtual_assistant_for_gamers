import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Asistente = sequelize.define(
  "asistente",
  {
    id_asistente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    modelo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    version: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "asistente",
    timestamps: false, // no es necesario por el contexto de uso de asistente
  }
);
