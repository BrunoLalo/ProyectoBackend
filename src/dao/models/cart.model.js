import mongoose from 'mongoose';
import productModel from './product.model.js';

mongoose.pluralize(null); 

const collection = 'carts';

const schema = new mongoose.Schema({
    created_at: Date,
    updated_at: Date,
    products: [
        {
            pid: { type: mongoose.Schema.Types.ObjectId },
            qty: Number
        }
    ]
});

schema.pre('save', function (next) {
    this.created_at = new Date();
    next();
});
schema.pre('update', function (next) {
    this.update({}, { $set: { updated_at: new Date() } });
    next();
});


export default mongoose.model(collection, schema);
;