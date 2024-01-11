import crypto from 'crypto';
import userModel from '../models/users.model.js';

class Users {
    constructor() {
        this.users = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['firstName', 'lastName', 'userName', 'password'];

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
        if (!Users.#objEmpty(user) && Users.#verifyRequiredFields(user)) {
            user.password = Users.#generarSha256(user.password);
            const process = await userModel.create(user);
            this.status = 1;
            this.statusMsg = "Usuario registrado en bbdd";
        } else {
            this.status = -1;
            this.statusMsg = `Faltan campos obligatorios (${Users.requiredFields.join(', ')})`;
        }
    }

    getUsers = async () => {
        const users = await userModel.find();

        this.status = 1;
        this.statusMsg = 'Usuarios recuperados';
        return users;
    }

    validateUser = async (user, pass) => {
        try {
            return await userModel.findOne({ userName: user, password: crypto.createHash('sha256').update(pass).digest('hex')});
        } catch (err) {
            this.status = `validateUser: ${err}`;
        }
    }

}

export default Users;