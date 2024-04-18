import mongoose from 'mongoose'
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'
import ProductController from './product.controller.mdb.js';
import userModel from '../models/users.model.js';

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
            if (newCart !== undefined) {
                console.log(newCart);
                const process = await cartModel.create(newCart)
                return process
            }

            return {newCart}
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

    getCart = async () => {
        try {
            const carts = await cartModel.find().lean()
            this.status = 1;
            this.statusMsg = 'Carritos recuperados'
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `readCarts: ${err}`
        }
    }

    getCartById= async (params) => {
        try {
            const cart = await cartModel.find({user_name: params}).populate({path:'products', populate:{path:'pid', model:'products'}})
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

    async processPurchase(cid) {
        const cart = await CartController.getCartById(cid);
    
        if (cart === null) {
          throw error;

        } else {
          let total = 0;
          let cartModified = false;
    
          for (const item of cart.products) {
            const pid = item.pid._id;
            const qty = item.qty;
            const stock = item.pid.stock;
            const price = item.pid.price;
    
            if (stock > 0) {
              let newStock = 0;
    
              if (stock >= qty) {
                newStock = stock - qty;
                item.qty = 0;
                total += qty * price;
              } else {
                newStock = 0;
                item.qty -= stock;
                total += stock * price;
              }
    
              await ProductController.updateProduct(pid, { stock: newStock });
              cartModified = true;
            }
          }
    
          if (cartModified) {
            await cart.save();
            await ticketService.addTicket({
              amount: total,
              purchaser: req.user._id,
            });
    
            return cart;
          } else {
            return error;
          }
        }
      }

}

