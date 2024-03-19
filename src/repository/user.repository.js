import Users from "../dao/controllers/users.controller.mdb.js";
import UserDto from '../dto/user.dto.js';


export class UserRepository {
  static async addUser(userData) {
    try {
      const user = await Users.createUser(userData);
      return new UserDto(user.email, user.nombre, user.apellido, user.rol);
    } catch (error) {
      throw error;
    }
  }

  static async getUserBy(params) {
    try {
      const user = await Users.getUserBy(params);
      return new UserDto(user.email, user.nombre, user.apellido, user.rol);
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id) {
    try {
      const user = await Users.getUserById(id);
      return new UserDto(user.email, user.nombre, user.apellido, user.rol);
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, newData) {
    try {
      const updatedUser = await Users.updateUser(id, newData);
      return new UserDto(updatedUser.email, updatedUser.nombre, updatedUser.apellido, updatedUser.rol);
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const deletedUser = await Users.deleteUser(id);
      return new UserDto(deletedUser.email, deletedUser.nombre, deletedUser.apellido, deletedUser.rol);
    } catch (error) {
      throw error;
    }
  }

}
