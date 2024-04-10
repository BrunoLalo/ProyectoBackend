import Users from "../dao/controllers/users.controller.mdb.js";
import {UserDto} from '../dto/user.dto.js';


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
      return new UserDto(user.email, user.nombre, user.apellido, user.rol, user._id);
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

  async updateUserRole(userId, newRole) {
    try {
      const updatedUser = await Users.updateUserRole(userId, newRole);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async usersByRoles(roles) {
    try {
      const usersByRole = await Users.usersByRoles(roles);
      return usersByRole.map(user => new UserDto(user));
    } catch (error) {
      throw error;
    }
  }

  async userCurrent(_id) {
    try {
      const userFound = await userDao.findOneUser(_id);
      return userFound ? new UserDto(user) : null;
    } catch (error) {
      throw error;
    }
  }

}
