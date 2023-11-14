import { Router } from 'express'
import ProductManager from '../ProductManager.js'


const router = Router()
const manager = new ProductManager()


router.get("/", async (req, res) =>{
    let allProducts = await manager.getProducts()
    res.render("index", {
        title: "Express",
        products: allProducts
    })
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realTimeProducts', {
        title : "Productos en Tiempo Real"
    })
})

export default router