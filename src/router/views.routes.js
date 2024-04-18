import { Router } from 'express'
import ProductController from '../dao/controllers/product.controller.mdb.js'
import CartController from '../dao/controllers/cart.controller.mdb.js'
import Users from '../dao/controllers/users.controller.mdb.js'
import userModel from '../dao/models/users.model.js'
import ticketModel from '../dao/models/ticket.model.js'
import { generateToken } from '../config/jwt.config.js'
import { createHash } from '../utils.js'
import { createLogger } from 'winston'
// import messageModel from '../dao/models/message.model.js'


const router = Router()
const controller = new ProductController()
const cart = new CartController()
const usersManager = new Users();

router.get("/", async (req, res) => {
    const products = await controller.getProducts()
    res.render("index", {
        title: "Express",
        products: products
    })
    // res.status(200).send({status: 'OK', data: allProducts})
})

router.get('/realtimeproducts', async (req, res) => {
    const products = await controller.getProducts()

    res.render('realTimeProducts', {
        title: "Productos en Tiempo Real",
        products: products

    })
})


router.get('/chat', async (req, res) => {
    res.render('chat', {
        title: "Chat"
    })
})


router.get('/products', async (req, res) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const products = await controller.getProductsPaginated({ page, limit });
        const user = req.session.user
        if (req.session.user) {
            res.render("products", {
                title: "Lista de Productos",
                products: products.docs,
                user: user.username,
                pagination: {
                    totalPages: products.totalPages,
                    currentPage: products.page,
                    hasNextPage: products.hasNextPage,
                    hasPrevPage: products.hasPrevPage,
                    nextPage: products.nextPage,
                    prevPage: products.prevPage,
                    limit: limit,
                },
            });
        } else {
            res.redirect("/login");
        }
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

// router.get('/cart', async (req, res) => {
//     const carts = await cart.getCart()

//     res.render('carts', {
//         title: "Carrito",
//         cart: carts
//     })
// })

router.get("/cart", async (req, res) => {
    try {
        const cartId = req.session.user.username;
        const cartAct = await cart.getCartById(cartId);
        const cartActId = cartAct._id
        console.log(cartAct)
        const ticket = await ticketModel.findOne({ purchaser: cartAct.user_name }).lean().exec();


        res.render('carts', {
            title: "Carrito",
            cart: cartAct,
            cartId: cartActId,
            ticket: ticket
        })

    } catch (err) {
        return res.status(500).json({ status: "error", error: err.message });
    }
});


router.get('/login', async (req, res) => {
    if (req.session.user) {
        res.redirect('/profile')
    } else {
        res.render('login', {})
    }
})

router.get('/users', async (req, res) => {
    const users = await usersManager.getUsers();
    res.render('users', { users });
})

router.get('/resetPass', async (req, res) => {
    res.render('resetPass.handlebars', {})
})

router.post("/resetPass", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersManager.getUserBy({ email: email });

        if (!user) {
            return res.status(404).send({ status: "ERR", data: "User not found" });
        }

        const updatedUser = {email: email, password: createHash(password)}

        const result = await userModel.updateOne(updatedUser)

        if (result.status === "ERR") {
            return res.status(500).send({ status: "ERR", data: result.data });
        }

        res.status(200).redirect('/login');
    } catch (err) {
        res.status(500).send({ status: "ERR", data: err.message });
    }
});

router.get('/register', async (req, res) => {
    res.render("register");
});


router.post('/register', async (req, res) => {
    const { first_name, last_name, user_name, email, gender, password } = req.body;
    if (!first_name || !last_name || !user_name || !email || !gender || !password) return res.status(400).send({ status: 'ERR', msg: 'Faltan campos completos en el body' });

    const user = await userModel.findOne({ user_name: email });
    if (user) return res.status(400).send({ status: 'ERR', msg: 'El email ya se encuentra registrado' });

    const newUser = { first_name: first_name, last_name: last_name, user_name: user_name, email: email, gender: gender, password: createHash(password) }
    const process = await userModel.create(newUser);
    delete newUser.password;
    const token = generateToken(newUser);

    res.status(200).redirect("/products");
});

router.get("/profile", async (req, res) => {
    if (req.session.user) {
        const user = req.session.user;
        res.render("profile", {
            user_name: `Usuario: ${user.username}`,
        });
    } else {
        res.redirect("/login");
    }
});


// router.post('/chat', async (req, res) => {
//     const { user, message } = req.body
//     if (!user || !message) {
//         return res.status(400).send({ status: 'ERR', data: 'No hay data' })
//     }
//     const newMessage = {
//         user: user,
//         message: message
//     }
//     const result = await messageModel.create(newMessage)

//     res.status(200).send({ status: 'OK', data: result })
// })
export default router