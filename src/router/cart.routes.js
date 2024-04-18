import { Router } from 'express'
import CartController from '../dao/controllers/cart.controller.mdb.js'
import cartModel from '../dao/models/cart.model.js'

const cartRouter = Router()
const cart = new CartController()

cartRouter.get('/', async (req, res) => {
    res.status(200).send(cart.getCart())
})

cartRouter.get('/:cid', async (req, res) => {
    res.status(200).send(await cart.getCartById(req.params.cid))
})

cartRouter.get("/:cid/purchase", async (req, res) => {
    try {
      res.status(200).send({
        status: "OK",
        data: await cart.processPurchase(req.params.cid),
      });
    } catch (err) {
      res.status(500).send({ status: "ERR", data: err.message });
    }
  });

cartRouter.post('/', async (req, res) => {
    const products_array = req.body;

    if (!Array.isArray(products_array.products)) {
        res.status(400).send({ status: 'ERR', message: 'No se pudo agregar' });
    } else {
        const process = await cart.addCart(products_array);
        res.status(200).send({ status: 'OK', data: process });
    }
})

cartRouter.post('/:cid/products/:pid/:qty', async (req, res) => {
    await cart.updateProductCant(req.params.cid, req.params.pid, req.params.qty);

    if (cart.checkStatus() === 1) {
        res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
    } else {
        res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto' });
    }
})


cartRouter.put('/:cid', async (req, res) => {
    const product = req.body;
    await cart.updateCart(req.params.cid, product);

    if (cart.checkStatus() === 1) {
        res.status(200).send({ status: 'OK', msg: 'Producto agregado al carrito' });
    } else {
        res.status(400).send({ status: 'ERR', error: 'No se pudo agregar el producto al carrito' });
    }
})

cartRouter.put('/:cid/products/:pid/:qty', async (req, res) => {
    await cart.updateProductCant(req.params.id, req.params.pid, req.params.qty);

    if (cart.checkStatus() === 1) {
        res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
    } else {
        res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto.' });
    }

    const updateProductCant = await cart.updateProductCant(req.params.cid, req.params.pid, req.body)
    res.status(200).send(updateProductCant)

})

cartRouter.delete('/:cid', async (req, res) => {
        await cart.emptyCart(req.params.cid);

        if (cart.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Carrito Vaciado' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo vaciar el carrito.' });
        }
});

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
        await cart.deleteCartProduct(req.params.cid, req.params.pid);

        if (cart.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto quitado del carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo quitar el producto en el carrito.' });
        }
});


export default cartRouter