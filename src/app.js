import express from 'express'
import { engine } from "express-handlebars"
import {Server} from 'socket.io'

import productRouter from './router/product.routes.js'
import cartRouter from './router/cart.routes.js'
import viewRouter from './router/views.routes.js'
import * as path from "path"
import  __dirname  from './utils.js'
import ProductManager from './ProductManager.js'

const PORT = 8080
const app = express()
const manager = new ProductManager()


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor express activo en puerto ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', socket =>{
    console.log("CLIENTE CONECTADO")

    socket.on('msg', data => {
        console.log(data)
        manager.addProducts(data)
        socketServer.emit('confirmation', 'Confirmado')

    })
    
})

app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.engine("handelbars", engine())
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "views"))

app.use("/", express.static(__dirname + "public"))


app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/", viewRouter)



