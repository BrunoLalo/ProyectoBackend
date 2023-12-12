import { Router } from 'express'
// import ProductManager from '../dao/controllers/ProductManager.fs.js'
import ProductController from '../dao/controllers/product.controller.mdb.js'


// const manager = new ProductManager()
const controller = new ProductController()

const productRouter = Router()

productRouter.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const type= parseInt(req.query.query)
    const sort = req.query.sort


    if (!limit || !page || !type || !sort) {
        return res.send(await controller.getProducts())
    }

    const products = await controller.getProducts()
    const productslimit = products.slice(0, limit)

    res.status(200).send(productslimit)
})

productRouter.get('/:pid', async (req, res) => {
    const pid = req.params.pid
    if (!pid) {
        return res.send(`Error:not found`)
    }

    const allProducts = await controller.getProducts()
    const productId = allProducts.find(product => product.id === pid)

    res.status(200).send(productId)
})

productRouter.post("/", async (req, res) => {
    const newproduct = req.body
    res.status(200).send(await controller.addProducts(newproduct))
})

productRouter.put("/:pid", async (req, res) => {
    const pid = req.params.pid
    let updateProduct = req.body

    res.status(200).send(await controller.updateProduct(pid, updateProduct))
})


productRouter.delete("/:pid", async (req, res) => {
    const pid = req.params.pid
    res.status(200).send(await controller.deleteProduct(pid))
})


productRouter.get('/paginated', async (req, res) => {
    try {
        const products = await controller.getProductsPaginated()
        res.status(200).send({ status: 'success', payload: products })
        
    } catch (error) {
        res.status(500).send({ status: 'error', payload: error.message })
    }
})


export default productRouter