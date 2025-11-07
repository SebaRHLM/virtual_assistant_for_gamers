// ai_service/nlp.routes.js
import express from "express";
import { NLPController } from "./nlp.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta protegida (requiere token JWT)
router.post("/chat", verifyToken, NLPController.handleChat);

export default router;
