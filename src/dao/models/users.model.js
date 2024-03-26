import mongoose from 'mongoose';
import { randomUUID } from "node:crypto";
import bcrypt from 'bcrypt';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: { type: String, required: false, index: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["user", "admin", "premium"], default: "user"}
}, {
    strict: 'throw',
    versionKey: false,
    methods: {
        infoPublica: function () {
            return {
                email: this.email,
                first_name: this.first_name,
                last_name: this.last_name,
            };
         },    

         comparePassword: async function (candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
            },
    },
});

const userModel = mongoose.model(collection, schema);

export default userModel;