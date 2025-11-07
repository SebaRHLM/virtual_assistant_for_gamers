import { User } from "../models/usuario.js";

// UserRepository es usado para el manejo de la tabla usuario.
export class UserRepository {
  //Encontrar un usuario por su email.
  static async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  //Crear un nuevo usuario.
  static async create(userData) {
    return await User.create(userData);
  }
}
