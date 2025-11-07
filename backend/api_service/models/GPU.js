// models/gpu.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const GPU = sequelize.define(
  "gpu",
  {
    id_gpu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    chipset: DataTypes.STRING(100),
    vram_gb: DataTypes.INTEGER,
    longitud_mm: DataTypes.INTEGER,
  },
  { tableName: "gpu", timestamps: false }
);