import { MessageRepository } from "../repositories/mensaje.js";

export class aiService {
  static async getResponse(req, res) {
    try {
      const { contenido } = req.body;
      const id_usuario = req.user.id_usuario;


      // Guardar mensaje del usuario
      const userMessage = await MessageRepository.crearMensajeUsuario({
        id_usuario,
        contenido,
        tipo_consulta: "general",
        es_de_usuario: true,
      });

      // Llamar al servicio de IA
      const respuesta = await fetch("http://127.0.0.1:8000/inference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: contenido }),
      });

      const data = await respuesta.json();

      if (!data.response) {
        throw new Error("Respuesta inválida del modelo de IA");
      }

      // Guardar respuesta de la IA
      const aiMessage = await MessageRepository.crearMensajeAI({
        id_usuario,
        id_asistente: 1,
        contenido: data.response,
        tipo_consulta: "general",
        es_de_usuario: false,
      });

      return { userMessage, aiMessage };
    } catch (error) {
      console.error("Error comunicándose con el microservicio de IA:", error);
      return "No se pudo obtener respuesta del modelo de IA.";
    }
  }
}
