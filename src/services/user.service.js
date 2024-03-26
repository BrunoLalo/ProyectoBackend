import { UserRepository } from "../repository/user.repository.js";
import { createHash } from "../utils.js"

class UserService {

    async addUser(userData) {
        try {
      
            userData.password = createHash(userData.password)
            const createUser = await UserRepository.addUser(userData);
            return createUser;
        } catch (error) {
            throw new Error('Error al crear usuario');
        }
    }
    
    async getUserBy(req, res) {
        const user = req.session.user._id;
    
        try {
            const userFound = await UserRepository.getUserBy(user._id ).lean();
            return res.successfullGet(userFound);
        } catch (error) {
            return res.failedGet();
        }
    }
    
    async getUserBy  ({id, password}){
        try {
            const user = await UserRepository.getUserBy({ id })
            if (!user) { throw new Error('authentication error') }
            if (!hasheadasSonIguales({
              recibida: password,
              almacenada: usuario.password
            })) {
              throw new Error('authentication error')
            }
            return user.toObject() 
        } catch (error) {
          throw new Error('Error finding user by username');
        }
      };

  
    async findManyUser(req, res) {
        const query = req.session.query;
    
        try {
            const usersFound = await userRepository.findManyUser(query ).lean();
            return res.successfullGet(usersFound);
        } catch (error) {
            return res.failedGet();
        }
    }


   async resetPassword (email, password) {
        try {
            const newPassword = createHash(password);

            const actualizado = await UserRepository.findOneAndUpdate(
                { email },
                { $set: { password: newPassword } },
                { new: true }
            ).lean();

            if (!actualizado) {
                throw new Error('usuario no encontrado');
            }

            return actualizado;
        } catch (error) {
            throw new Error('Error al restablecer la contraseña del usuario');
        }
    }

    async usersByRoles(roles) {
        try {
            const usersByRole = await UserRepository.usersByRoles(roles);
            return usersByRole.map(user => user.toPOJO());
        } catch (error) {
            throw error;
        }
    }

    async updateUser(id, newData) {
        try {
            const updatedUser = await UserRepository.updateUser(id, { $set: { newData } });
            if (!updatedUser) {
            throw new Error('Usuario no encontrado')}
            return updatedUser;
        } catch (error) {
            throw new Error('Error al modificar los datos del usuario');
        }
    }

    async userCurrent (userId) {
        try {
            const user = await userRepository.findOneUser(userId);
            return {
                id: user.id,
                username: user.username,
            };
        } catch (error) {
          throw new Error('Error al obtener el usuario actual');
        }
    }

    async deleteUser (userId) {
        try {
          const deletedUser = await UserRepository.deleteUser(userId);
          return deletedUser ? deletedUser.toObject() : null;
        } catch (error) {
          throw new Error('Error al eliminar usuario en el servicio');
        }
    }

    async updateUserRole(userId, newRole) {
        try {
            const updatedUser = await userRepository.updateUserRole(userId, newRole);
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    
}

export const usersServices = new UserService()