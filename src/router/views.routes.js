import { Router } from 'express'
import ProductController from '../dao/controllers/product.controller.mdb.js'
import CartController from '../dao/controllers/cart.controller.mdb.js'
import messageModel from '../dao/models/message.model.js'


const router = Router()
const controller = new ProductController()
const cart = new CartController()

router.get("/", async (req, res) => {
    const products = await controller.getProducts()
    res.render("index", {
        title: "Express",
        products: products
    })
    // res.status(200).send({status: 'OK', data: allProducts})
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await controller.getProducts()

    res.render('realTimeProducts', {
        title: "Productos en Tiempo Real",
        products: products

    })
})


router.get('/chat', async (req, res) => {
    res.render('chat', {
        title: "Chat"
    })
})

// router.post('/chat', async (req, res) => {
//     const { user, message } = req.body
//     if (!user || !message) {
//         return res.status(400).send({ status: 'ERR', data: 'No hay data' })
//     }
//     const newMessage = {
//         user: user,
//         message: message
//     }
//     const result = await messageModel.create(newMessage)

//     res.status(200).send({ status: 'OK', data: result })
// })

router.get('/products', async (req, res) => {
    const products = await controller.getProductsPaginated()

    products.pages = []
    for (let i = 1; i <= products.totalPages; i++) products.pages.push(i)

    res.render('products', {
        title: 'Listado de PRODUCTOS',
        data: products
    })
})

router.get('/cart', async (req, res) => {
    const carts = await cart.getCart()

    res.render('carts', {
        title: "Carrito",
        cart: carts
    })
})

router.get('/cart/:cid', async (req, res) => {

    const carts = await cart.getCartById(req.params.cid)

    res.render('carts', {
        title: "Carrito",
        cart: carts
    })
})

export default router