import express from 'express'
import ProductManager from './ProductManager.js'

const PORT = 8080
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const manager = new ProductManager()

app.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit)

    if(!limit){
        return res.send(await manager.getProducts())
    }
    const allProducts = await manager.getProducts()
    const productslimit = allProducts.slice(0, limit)


    res.send(productslimit)
})


app.get('/products/:pid', async(req, res) => {
    const pid = parseInt(req.params.pid)
    if(!pid){
        return res.send(`Error:not found`)
    }
    
    const allProducts = await manager.getProducts()
    const productId = allProducts.find(product=> product.id === pid)
    

    res.send(productId)
})



app.listen(PORT, () => {
    console.log(`Servidor express activo en puerto ${PORT}`)
})
