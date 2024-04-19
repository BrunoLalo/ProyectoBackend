import mongoose from 'mongoose';
import { randomUUID } from "node:crypto";
import bcrypt from 'bcrypt';
import cartModel from './cart.model.js';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: { type: String, required: false },
    last_name: { type: String, required: false },
    user_name:{ type: String, required: true},
    email: { type: String,  },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["user", "admin", "premium"], default: "user"},
    cart: { type: cartModel.schema },
    documents: [{ name: String, reference: String }],
    last_connection: { type: Date, default: Date.now }
}, {
    strict: 'throw',
    versionKey: false,
    methods: {
        infoPublica: function () {
            return {
                email: this.email,
                first_name: this.first_name,
                last_name: this.last_name,
                user_name: this.user_name,
            };
         },    

         comparePassword: async function (candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
            },
    },
});

const userModel = mongoose.model(collection, schema);

export default userModel;