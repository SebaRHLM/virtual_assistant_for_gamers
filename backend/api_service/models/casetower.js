import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const CaseTower = sequelize.define(
  "case_tower",
  {
    id_case: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    form_factor: DataTypes.STRING(50),
    max_gpu_length: DataTypes.INTEGER,
  },
  { tableName: "case_tower", timestamps: false }
);