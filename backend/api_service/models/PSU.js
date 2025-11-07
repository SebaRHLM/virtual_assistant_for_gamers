import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const PSU = sequelize.define(
  "psu",
  {
    id_psu: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    potencia_w: DataTypes.INTEGER,
    eficiencia: DataTypes.STRING(50),
  },
  { tableName: "psu", timestamps: false }
);