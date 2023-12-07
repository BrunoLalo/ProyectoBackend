import mongoose from 'mongoose'
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

export default class CartController {
    constructor() {
        this.status = 0;
        this.statusMsg = "inicializado"
    }

    checkStatus = () => {
        return this.status
    }

    showStatusMsg = () => {
        return this.statusMsg
    }

    addCart = async (newCart) => {
        try {
            if (newCart !== undefined && newCart.products.length > 0) {
                console.log(newCart);
                const process = await cartModel.create(newCart)
                return process
            }

            return {}
        } catch (err) {
            console.log(err.message)
        }
    };

    updateCart = async (id, new_product) => {
        try {
            const cart_updated = await cartModel.findOneAndUpdate(
                { _id: id },
                { $push: { products: new_product }},
                { new: true }
            );
            
            this.status = 1
            this.statusMsg = 'Carrito actualizado'
            return cart_updated;
        } catch (err) {
            this.status = -1
            this.statusMsg = `updateCart: ${err}`
        }
    }

    updateProductCant = async (id, pid, new_product_qty) => {
        try {
            const carts = await cartModel.findOneAndUpdate(
                { _id: id, 'products.pid': pid },
                { $set: { 'products.$.qty': new_product_qty }},
                { new: true }
            );

            this.status = 1
            this.statusMsg = 'Cantidad de producto actualizada en carrito'
            return process
        } catch (err) {
            this.status = -1
            this.statusMsg = `updateProductCant: ${err}`
        }
    }

    readCart = async () => {
        try {
            const carts = await cartModel.find()
            this.status = 1;
            this.statusMsg = 'Carritos recuperados'
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `readCarts: ${err}`
        }
    }

    getCartById= async (id) => {
        try {
            const cart = await cartModel.find({ _id: new mongoose.Types.ObjectId(id) }).populate({ path: 'products.pid', model: productModel });
            this.status = 1
            this.statusMsg = 'Carrito recuperado'
            return cart;
        } catch (err) {
            this.status = -1
            this.statusMsg = `getCarts: ${err}`
        }
    }

    emptyCart = async (id) => {
        try {
            const process = await cartModel.findOneAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $set: { products: [] }
            });

            this.status = 1;
            this.statusMsg = 'Carrito vaciado'
            return process
        } catch (err) {
            return false
        }
    }

    deleteCartProduct = async (id, pid) => {
        try {
            const process = await cartModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $pull: { products: { pid: new mongoose.Types.ObjectId(pid) }}},
                { new: true }
            )
            
            this.status = 1;
            this.statusMsg = 'Producto quitado del carrito'
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteCartProduct: ${err}`
        }
    }
}

