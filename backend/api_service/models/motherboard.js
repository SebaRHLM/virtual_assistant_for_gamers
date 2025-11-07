import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Componente } from "./componente.model.js";

export const Motherboard = sequelize.define(
  "motherboard",
  {
    id_motherboard: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Componente,
        key: "id_componente",
      },
      onDelete: "CASCADE",
    },
    socket: DataTypes.STRING(50),
    ram_type: DataTypes.STRING(50),
    chipset: DataTypes.STRING(100),
  },
  { tableName: "motherboard", timestamps: false }
);