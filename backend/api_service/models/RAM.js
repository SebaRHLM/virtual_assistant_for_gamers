import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const RAM = sequelize.define(
  "ram",
  {
    id_ram: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    tipo_ram: DataTypes.STRING(50),
    capacidad_gb: DataTypes.INTEGER,
    velocidad_mhz: DataTypes.INTEGER,
  },
  { tableName: "ram", timestamps: false }
);