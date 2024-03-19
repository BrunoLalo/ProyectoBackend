import mongoose from "mongoose";
import { hasheoPrev } from "../utils.js";
import userModel from "../dao/models/users.model.js";

export async function authUser(name, pass) {
    let datos;
    const user = await mongoose.model('users').findOne({ first_name: name }).lean();

    if (name === "adminCoder" && pass === 'admin111') {
        datos = {
            first_name: 'adminCoder',
            last_name: 'admin',
            email: 'admin@admin.com',
            role: 'admin'
        }
    } else {
        if (!user) {
            throw new Error('Usuario no encontrado');
        }

        if (!hasheoPrev(pass, user.password)) {
            throw new Error('Los datos no coinciden');
        }

        datos = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: 'usuario'
        }
    }

    return datos
}