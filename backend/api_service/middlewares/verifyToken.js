import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from "../server.config.js";

export const verifyToken = (req, res, next) => {
  // esperamos header: Authorization: Bearer xxx.yyy.zzz
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY);
    // guardamos el user en la request
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Token inválido o expirado" });
  }
};

