import { Router } from 'express'
import ProductManager from '../dao/controllers/ProductManager.fs.js'


const router = Router()
const manager = new ProductManager()


router.get("/", async (req, res) => {
    const allProducts = await manager.getProducts()
    // res.render("index")
    res.render("index", {
        title: "Express",
        products: allProducts
    })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        title: "Productos en Tiempo Real"
    })
})

export default router