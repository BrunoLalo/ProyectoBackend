import mongoose from 'mongoose'
import productModel from './product.model.js'

mongoose.pluralize(null)

const collection = 'carts'

const schema = new mongoose.Schema({
    products: [{
        pid: { type: [mongoose.Schema.Types.ObjectId], ref: 'products' },
        qty: Number,
    }],
    user: { type: String, required: true },
    totalAmount: { type: Number, default: 0 },  
})

schema.pre('find', function () {
    this.populate({ path: 'products', model: productModel })
})

export default mongoose.model(collection, schema)

