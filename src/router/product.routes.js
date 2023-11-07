import { Router } from 'express'
import ProductManager from '../ProductManager.js'


const manager = new ProductManager()

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit)

    if(!limit){
        return res.send(await manager.getProducts())
    }

    const allProducts = await manager.getProducts()
    const productslimit = allProducts.slice(0, limit)

    res.status(200).send(productslimit)
})


productRouter.get('/:pid', async(req, res) => {
    const pid = req.params.pid
    if(!pid){
        return res.send(`Error:not found`)
    }
    
    const allProducts = await manager.getProducts()
    const productId = allProducts.find(product=> product.id === pid)

    res.status(200).send(productId)
})

productRouter.post("/", async (req, res)=>{
    let newproduct = req.body
    res.status(200).send(await manager.addProducts(newproduct))
})

productRouter.put("/:pid", async(req, res) => {
    const pid = req.params.pid
    let updateProduct= req.body

    res.status(200).send(await manager.updateProduct(pid, updateProduct))
})


productRouter.delete("/:pid", async(req, res) => {
    const pid = req.params.pid
    res.status(200).send(await manager.deleteProduct(pid))
})

export default productRouter