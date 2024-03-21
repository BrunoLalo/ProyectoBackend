import express from 'express'
import handlebars from "express-handlebars"
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import FileStore from 'session-file-store'
import passport from 'passport'
import cookieParser from 'cookie-parser'

import productRouter from './router/product.routes.js'
import cartRouter from './router/cart.routes.js'
import viewRouter from './router/views.routes.js'
import sessionsRouter from './router/sessions.routes.js'
import userRoutes from './router/users.routes.js'
import cookieRouter from './router/cookies.routes.js'
import mockRouter from './router/mocking.routes.js'
import { __dirname } from './utils.js'
import initPassport from './config/passport.config.js'
import config from './config.js'
import {sessions} from './middleware/sessions.js'
import { loggerInRequest, getLogger } from './middleware/logger.js'
import { loggerTest } from './services/loggerTest.js'
import { errorHandler } from './middleware/error.log.js'





// const PORT = 8080
// const MONGOOSE_URL = 'mongodb+srv://lalomiabruno:lalomiabruno@cluster0.oqofsvd.mongodb.net/ecommerce'

const app = express()


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/static', express.static(`${__dirname} /public`))

initPassport();
app.use(passport.initialize());
app.use(cookieParser());

const fileStorage = FileStore(sessions);

app.use(sessions)
initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(loggerInRequest)

app.use("/", viewRouter)
app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', userRoutes)
app.use('/api/cookies', cookieRouter)
app.use('/mockingproducts', mockRouter)

const logger = getLogger()

logger.info(`Base de Datos Conectada "${MONGODB_CNX_STR}"`)

app.use(errorHandler)
app.get('/loggerTest', loggerTest)


app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");


try {
    await mongoose.connect(config.MONGO_URL);
    const server = app.listen(config.PORT, () => {
        console.log(`Backend activo en puerto ${config.PORT}`);
    });
} catch (err) {
    console.log(`No se puede conectar con base de datos (${err.message})`);
}


// const httpServer = app.listen(PORT, () => {
    //     console.log(`Servidor express activo en puerto ${PORT}`)
    // })
    
    // const messages = []
    
    // const socketServer = new Server(httpServer, {
        //     cors: {
//         origin: "*",
//         methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
//         credentials: false
//     }
// })

// socketServer.on('connection', socket => {
//     socket.on('message', data => {
//         messages.push(data)

//         socketServer.emit('messageLogs', messages)
//     })


// })

//  socketServer.on('connection', socket => {
    //      console.log("CLIENTE CONECTADO")
//      socket.on('msg', data => {
//          console.log(data)
//          manager.addProducts(data)
//          socketServer.emit('confirmation', 'Confirmado')
//      })
//  })



