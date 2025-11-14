import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { aiController } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", verifyToken, aiController);
export default router;
