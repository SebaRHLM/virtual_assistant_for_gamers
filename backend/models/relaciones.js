import { Usuario } from "./usuario.js";
import { Asistente } from "./asistente.js";
import { Mensaje } from "./mensaje.js";

import { Componente } from "./componente.js";
import { CPU } from "./CPU.js";
import { GPU } from "./GPU.js";
import { Motherboard } from "./motherboard.js";
import { RAM } from "./RAM.js";
import { PSU } from "./PSU.js";
import { Storage } from "./storage.js";
import { CaseTower } from "./casetower.js";

/* ======================================================
        Relaciones: Usuario - Asistente - Mensaje
====================================================== */

// Un usuario puede tener muchos mensajes
Usuario.hasMany(Mensaje, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
});

// Un mensaje pertenece a un usuario
Mensaje.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  onDelete: "CASCADE",
});

// Un asistente puede tener muchos mensajes
Asistente.hasMany(Mensaje, {
  foreignKey: "id_asistente",
  onDelete: "SET NULL",
});

// Un mensaje pertenece a un asistente
Mensaje.belongsTo(Asistente, {
  foreignKey: "id_asistente",
  onDelete: "SET NULL",
});

/* ======================================================
    Relaciones: Componente - Tipos de Componentes (1:1)
====================================================== */

// CPU y Componente
Componente.hasOne(CPU, { foreignKey: "id_cpu", onDelete: "CASCADE" });
CPU.belongsTo(Componente, { foreignKey: "id_cpu", onDelete: "CASCADE" });

// GPU y Componente
Componente.hasOne(GPU, { foreignKey: "id_gpu", onDelete: "CASCADE" });
GPU.belongsTo(Componente, { foreignKey: "id_gpu", onDelete: "CASCADE" });

// Motherboard y Componente
Componente.hasOne(Motherboard, { foreignKey: "id_motherboard", onDelete: "CASCADE" });
Motherboard.belongsTo(Componente, { foreignKey: "id_motherboard", onDelete: "CASCADE" });

// RAM y Componente
Componente.hasOne(RAM, { foreignKey: "id_ram", onDelete: "CASCADE" });
RAM.belongsTo(Componente, { foreignKey: "id_ram", onDelete: "CASCADE" });

// PSU y Componente
Componente.hasOne(PSU, { foreignKey: "id_psu", onDelete: "CASCADE" });
PSU.belongsTo(Componente, { foreignKey: "id_psu", onDelete: "CASCADE" });

// Storage y Componente
Componente.hasOne(Storage, { foreignKey: "id_storage", onDelete: "CASCADE" });
Storage.belongsTo(Componente, { foreignKey: "id_storage", onDelete: "CASCADE" });

// Case Tower y Componente
Componente.hasOne(CaseTower, { foreignKey: "id_case", onDelete: "CASCADE" });
CaseTower.belongsTo(Componente, { foreignKey: "id_case", onDelete: "CASCADE" });

/* ======================================================
                    Exportar para uso General
====================================================== */
export {
  Usuario,
  Asistente,
  Mensaje,
  Componente,
  CPU,
  GPU,
  Motherboard,
  RAM,
  PSU,
  Storage,
  CaseTower,
};
