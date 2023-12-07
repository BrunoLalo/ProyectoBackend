import { Router } from 'express'
import ProductController from '../dao/controllers/product.controller.mdb.js'
import messageModel from '../dao/models/message.model.js'


const router = Router()
const controller = new ProductController()

router.get("/", async (req, res) => {
    const allProducts = await controller.getProducts()
    res.render("index", {
        title: "Express",
        products: allProducts
    })
    // res.status(200).send({status: 'OK', data: allProducts})
})

router.get('/realtimeproducts', async (req, res) => {
    const allProducts = await controller.getProducts()

    res.render('realTimeProducts', {
        title: "Productos en Tiempo Real",
        products: allProducts

    })
})


router.get('/chat', async (req, res) => {
    res.render('chat', {
        title: "Chat"
    })
})

router.post('/chat', async (req, res) => {
    const { user, message } = req.body
    if (!user || !message) {
        return res.status(400).send({ status: 'ERR', data: 'No hay data' })
    }
    const newMessage = {
        user: user,
        message: message
    }
    const result = await messageModel.create(newMessage)

    res.status(200).send({ status: 'OK', data: result })
})


export default router