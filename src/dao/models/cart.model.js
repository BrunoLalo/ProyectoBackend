import mongoose from 'mongoose'
import productModel from './product.model.js'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    products: [{
        pid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products',
            required: true
            },
        qty: {
            type: Number,
            default: 1
            }
        }],
    user_name: {
        type: mongoose.Schema.Types.String,
        ref: 'users',
        required: true
        },
    })


export default mongoose.model(collection, schema)

