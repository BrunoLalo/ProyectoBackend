import { Router } from 'express'
import CartManager from '../CartManager.js'

const cartRouter = Router()
const cart = new CartManager

cartRouter.post("/", async (req, res) => {
    res.status(200).send(await cart.addCart())
})

cartRouter.get('/', async (req, res) => {
    res.status(200).send(cart.readCart())
})

cartRouter.get('/:cid', async (req, res) => {
    res.status(200).send(await cart.getCartById(req.params.id))
})

cartRouter.post('/:cid/products/pid', async (req,res) => {
    let cartId = req.params.cid
    let productId = req.params.pid

    res.status(200).send(await cart.addProductInCart(cartId, productId))
})



export default cartRouter