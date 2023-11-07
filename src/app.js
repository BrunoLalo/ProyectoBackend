import express from 'express'
import productRouter from './router/product.routes.js'
import cartRouter from './router/cart.routes.js'


const PORT = 8080
const app = express()

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)


app.listen(PORT, () => {
    console.log(`Servidor express activo en puerto ${PORT}`)
})
