import fs from "fs"
import { nanoid } from 'nanoid'
import ProductManager from './ProductManager.js'

const productALL = new ProductManager 

class CartManager{
    constructor(){
        this.path = "./cart.json"
        this.cart = []
    }

    async readCart() {
        let respuesta = await fs.promises.readFile(this.path, { encoding: 'utf8' })
        return (JSON.parse(respuesta))
    }

    async exist(id){
        let cart = await this.readCart()
        return cart.find(cart => cart.id ===id)
    }

    async addCart() {
        let cartOld = await this.readCart() 
        let id = nanoid(1)
        let newCart = [{id: id, product: []}, ...cartOld]  

        await fs.promises.writeFile(this.path, JSON.stringify(newCart, null, 2))

        return "Agregado"
    }

    async getCartById(id) {
        const getId = this.cart.find((cart) => cart.id === id)

        if (getId) {
            console.log(getId)
        } else {
            console.log('Error: not found')
        }
    }

    async addProductInCart(cartId, productId) {
        const getId = await this.exist(cartId)
        if (!getId) return "Carrito no encontrado"
        let productById = await productALL.exist(productId)
        if (!productById) return "Producto no encontrado"
        
        let cartAll = await this.readCart()
        let cartFilter = cartAll.filter(cart => cart.id != cartId)

        if(getId.products.some(prod => prod.id === productId)){
            let productInCart = getId.products.find(prod => prod.id === productId)
            productInCart.quantity++

            let cartConcat = [getId, ...cartFilter]
            await this.addCart(cartConcat)
            return "Producto sumado al carrito"
        }

        getId.products.push({id:productById.id, quantity: 1})
        
        let cartConcat = [getId, ...cartFilter]
        await this.addCart(cartConcat)

        return "Producto agregado al carrito"
    }
}

export default CartManager