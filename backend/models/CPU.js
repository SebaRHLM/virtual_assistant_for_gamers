// models/cpu.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const CPU = sequelize.define(
  "cpu",
  {
    id_cpu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    socket: DataTypes.STRING(50),
    nucleos: DataTypes.INTEGER,
    hilos: DataTypes.INTEGER,
    frecuencia_ghz: DataTypes.DECIMAL(4, 2),
  },
  { tableName: "cpu", timestamps: false }
);