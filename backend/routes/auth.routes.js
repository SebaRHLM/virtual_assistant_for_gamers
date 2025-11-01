import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
//import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//router.get("/protected", verifyToken, /*getProfile*/  '');

export default router;