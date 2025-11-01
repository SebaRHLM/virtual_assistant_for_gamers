import { Message } from "../models/mensaje";

export const MessageRepository = {
  async crearMensajeUsuario({ id_usuario, contenido, intencion = null }) {
    return await Message.create({
      id_usuario,
      emisor: "user",
      contenido,
      intencion,
    });
  },

  async crearMensajeAI({ id_usuario, contenido, intencion = null }) {
    return await Message.create({
      id_usuario,
      emisor: "ai",
      contenido,
      intencion,
    });
  },

  async obtenerMensajesPorUsuario(id_usuario, limit = 20) {
    return await Message.findAll({
      where: { id_usuario },
      order: [["fecha_envio", "DESC"]],
      limit,
    });
  },
};
