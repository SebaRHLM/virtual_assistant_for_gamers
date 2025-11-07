import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Usuario } from "./usuario.js";   // asegúrate de que el nombre coincida con tu modelo
import { Asistente } from "./asistente.js"; // si tienes el modelo de Asistente

export const Mensaje = sequelize.define(
  "mensaje",
  {
    id_mensaje: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario",
        key: "id_usuario",
      },
      onDelete: "CASCADE",
    },
    id_asistente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "asistente",
        key: "id_asistente",
      },
      onDelete: "SET NULL",
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo_consulta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: "general",
        validate: {
            isIn: [["compatibilidad", "comparacion", "general"]],
        },
    },
    fecha_envio: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    es_de_usuario: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "mensaje",
    timestamps: false, // se hace con fecha_envio
  }
);

// Relaciones
Mensaje.belongsTo(Usuario, { foreignKey: "id_usuario", onDelete: "CASCADE" });
Mensaje.belongsTo(Asistente, { foreignKey: "id_asistente", onDelete: "SET NULL" });
