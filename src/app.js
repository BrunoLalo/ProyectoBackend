import express from 'express'
// import { engine } from "express-handlebars"
import handlebars from "express-handlebars";
import { Server } from 'socket.io'
import mongoose from 'mongoose'

import productRouter from './router/product.routes.js'
import cartRouter from './router/cart.routes.js'
import viewRouter from './router/views.routes.js'
import { __dirname } from './utils.js'
import ProductManager from './dao/controllers/ProductManager.fs.js'

const app = express()
const PORT = 8080
const MONGOOSE_URL = 'mongodb://127.0.0.1:27017/Proyecto-back'
//const MONGOOSE_URL = 'mongodb+srv://lalomiabruno:<lalomiabruno>@cluster0.oqofsvd.mongodb.net/ecommerce'
const manager = new ProductManager()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// app.use("/", express.static(__dirname + "public"))
app.use('/static', express.static(`${__dirname}/public`))


app.use("/", viewRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)

// app.engine("handelbars", engine())
// app.set("view engine", "handlebars")
// app.set("views", path.resolve(__dirname + "views"))
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor express activo en puerto ${PORT}`)
})

const messages = []

const socketServer = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
        credentials: false
    } 
})

socketServer.on('connection', socket => {
    socket.on('message', data => {
        messages.push(data)

        socketServer.emit('messageLogs', messages)
    })
    
    
})

// socketServer.on('connection', socket => {
//     console.log("CLIENTE CONECTADO")
//     socket.on('msg', data => {
//         console.log(data)
//         manager.addProducts(data)
//         socketServer.emit('confirmation', 'Confirmado')
//     })
// })


try {
    await mongoose.connect(MONGOOSE_URL)
    console.log('Backend conectado')
} catch (err) {
    console.log(`No se puede conectar con bbdd (${err.message})`)
}


