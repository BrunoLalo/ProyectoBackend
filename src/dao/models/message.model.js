import mongoose from 'mongoose'

mongoose.pluralize(null)

const collection = 'messages'

const schema = new mongoose.Schema({
    user: { type: String, required: true },
    message:  { type: String, required: true }
});

export default mongoose.model(collection, schema)