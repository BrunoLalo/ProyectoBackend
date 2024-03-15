import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({
    first_name: { type: String, required: false, index: true },
    last_name: { type: String, required: false },
    email: { type: String, required: true },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String, enum: ["user", "admin"], default: "user"}
});

const userModel = mongoose.model(collection, schema);

export default userModel;