// models/componente.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Componente = sequelize.define(
  "componente",
  {
    id_componente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    marca: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["CPU", "GPU", "Motherboard", "RAM", "PSU", "Storage", "Case"]],
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "componente",
    timestamps: false,
  }
);
