import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const Storage = sequelize.define(
  "storage",
  {
    id_storage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    tipo: DataTypes.STRING(50),
    capacidad_gb: DataTypes.INTEGER,
    interfaz: DataTypes.STRING(50),
  },
  { tableName: "storage", timestamps: false }
);