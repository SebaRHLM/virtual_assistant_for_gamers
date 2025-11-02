import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/usuario.js";
import jwt from "jsonwebtoken";

export class AuthService {

  // Registro de usuario
  static async register({ rut, username, region, comuna, email, password }) {
    // Verificacion de existencia
    const existing = await UserRepository.findByEmail(email);
    if (existing) throw new Error("El usuario ya existe");

    // Encriptar contraseña
    const password_hash = await bcrypt.hash(password, parseInt(process.env.COD_ROUNDS));

    const newUser = await UserRepository.create({
      rut,
      username,
      region,
      comuna,
      email,
      password_hash,
    });

    return {
      success: true,
      message: "Usuario registrado correctamente",
      data: {
        id_usuario: newUser.id_usuario,
        username: newUser.username,
        email: newUser.email,
        rol: newUser.rol,
      },
    };
  }

  // Login de usuario
  static async login({ email, password }) {
    // Verificar si el usuario existe
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("Usuario no encontrado");

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Contraseña incorrecta");

    // Si todo es correcto, generar un token JWT
    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        email: user.email,
        rol: user.rol,
      },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "1h" }
    );

    return {
      success: true,
      message: "Login exitoso",
      token,
      data: {
        id_usuario: user.id_usuario,
        username: user.username,
        rut: user.rut,
        region: user.region,
        comuna: user.comuna,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}
