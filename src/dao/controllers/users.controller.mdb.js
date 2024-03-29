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
            if (!Users.#objEmpty(user) && Users.#verifyRequiredFields(user)) {
                user.password = createHash(user.password);
                const process = await userModel.create(user);
                this.status = 1;
                this.statusMsg = "Usuario registrado en bbdd";
            } else {
                this.status = -1;
                this.statusMsg = `Faltan campos obligatorios (${Users.requiredFields.join(', ')})`;
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `AddUser: ${err.message}`;
        }
    }

    getUsers = async () => {
        try {
            const users = await userModel.find().populate('courses');
            this.status = 1;
            this.statusMsg = 'Usuarios recuperados';
            return users.map(user => user.toObject());
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUsers: ${err.message}`;
        }
    }

    getUserBy = async (params) => {
        try {
            this.status = 1;
            const user = await userModel.findOne(params).populate('courses').lean();
            return user;
        } catch(err) {
            this.status = -1;
            this.statusMsg = `getUserBy: ${err.message}`;
        }
    }

    getUserById = async (id) => {
        try {
            this.status = 1;
            const user = userModel.findById(id).populate('courses').lean();
            return user;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUserById: ${err.message}`;
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
            const updatedUser = await UserModel.findOneAndUpdate(userId, newRole);
            return updatedUser.toObject();
        } catch (error) {
            throw new Error('Error al actualizar usuario por email en la base de datos');
        }
    }

}

export default Users;