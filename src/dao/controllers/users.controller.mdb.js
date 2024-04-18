import crypto from 'crypto';
import mongoose from 'mongoose';
import userModel from '../models/users.model.js';
import { createHash } from '../../utils.js';


class Users {
    constructor() {
        this.users = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['firstName', 'lastName', 'userName', 'password', 'gender'];

    static #verifyRequiredFields = (obj) => {
        return Users.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #generarSha256 = (pass) => {
        return crypto.createHash('sha256').update(pass).digest('hex');
    }

    static #objEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    addUser = async (user) => {
        try {
            const doc = await userModel.create(user)
            return doc
        } catch (error) {
            throw error;
        }
    }

    getUsers = async () => {
        try {
            const users = await userModel.find().lean();
            this.status = 1;
            this.statusMsg = 'Usuarios recuperados';
            return users;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUsers: ${err.message}`;
        }
    }

    getUserBy = async (params) => {
        try {
            this.status = 1;
            const user = await userModel.findOne(params).lean();
            return user;
        } catch(err) {
            this.status = -1;
            this.statusMsg = `getUserBy: ${err.message}`;
        }
    }


    updateUser = async (id, data) => {
        try {
            if (data === undefined || Object.keys(data).length === 0) {
                this.status = -1;
                this.statusMsg = "Se requiere body con data";
            } else {
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(id) }, data);
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Usuario actualizado";
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err.message}`;
        }
    }

    deleteUser = async (id) => {
        try {
            const process = await userModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            this.status = 1;
            process.deletedCount === 0 ? this.statusMsg = "El ID no existe": this.statusMsg = "Usuario borrado";
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteUser: ${err.message}`;
        }
    }

    validateUser = async (user, pass) => {
        try {
            return await userModel.findOne({ userName: user, password: crypto.createHash('sha256').update(pass).digest('hex') });
        } catch (err) {
            this.status = `validateUser: ${err}`;
        }
    }

    updateUserRole = async (userId, newRole) => {
        try {
            const updatedUser = await userModel.findOneAndUpdate(userId, newRole);
            return updatedUser.toObject();
        } catch (error) {
            throw new Error('Error al actualizar usuario por email en la base de datos');
        }
    }

}

export default Users;