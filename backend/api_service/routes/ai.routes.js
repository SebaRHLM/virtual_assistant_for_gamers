// routes/ai.routes.js
import express from "express";
import fetch from "node-fetch";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { MessageRepository } from "../repositories/mensaje.js";

const router = express.Router();

router.post("/chat", verifyToken, async (req, res) => {
  try {
    const { contenido } = req.body;
    const id_usuario = req.user.id_usuario;

    // Guardar mensaje del usuario
    const userMessage = await MessageRepository.create({
      id_usuario,
      contenido,
      tipo_consulta: "general",
      es_de_usuario: true,
    });

    // Llamar al microservicio de IA
    const response = await fetch("http://127.0.0.1:8000/inference", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: contenido }),
    });

    const data = await response.json();

    // Guardar respuesta IA
    const aiMessage = await MessageRepository.create({
      id_asistente: 1, // Asistente por defecto zeroAI
      contenido: data.response,
      tipo_consulta: "general",
      es_de_usuario: false,
    });

    res.json({ success: true, data: { userMessage, aiMessage } });
  } catch (error) {
    console.error("Error en /chat:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
