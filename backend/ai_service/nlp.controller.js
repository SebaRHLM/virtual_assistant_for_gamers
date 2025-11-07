import { NLPService } from "./nlp.service.js";
import { MensajeRepository } from "../repositories/mensaje.repository.js";

/*
    Aqui almavenamos la lógiaca de:
    *   Recibir el mensaje del usuario.
    *   Guardar el mensaje en la base de datos.
    *   Procesar el mensaje para obtener la intención (comparar componentes o verificar compatibilidad)
    *   Generar la respuesta de la IA.
    *   Guardar la respuesta de la IA en la base de datos.
*/

export class NLPController {
  static async handleChat(req, res) {
    try {
      const { id_usuario, contenido } = req.body;

      if (!id_usuario || !contenido) {
        return res.status(400).json({ success: false, message: "Datos incompletos" });
      }

      // Guardar mensaje del usuario
      const userMessage = await MensajeRepository.create({
        id_usuario,
        contenido,
        tipo_consulta: "general",
        es_de_usuario: true,
      });

      // Procesar con el modelo
      const respuesta = await NLPService.processPrompt(contenido);

      // Guardar respuesta de la IA
      const aiMessage = await MensajeRepository.create({
        id_asistente: 1, // ID del asistente por defecto
        contenido: respuesta,
        tipo_consulta: "general",
        es_de_usuario: false,
      });

      res.json({
        success: true,
        message: "Interacción procesada correctamente",
        data: {
          userMessage,
          aiMessage,
        },
      });
    } catch (error) {
      console.error("❌ Error en NLPController:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
