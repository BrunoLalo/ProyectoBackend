import { Router } from 'express'
// import ProductManager from '../dao/controllers/ProductManager.fs.js'
import ProductController from '../dao/controllers/product.controller.mdb.js'
import { uploader } from '../uploader.js'


// const manager = new ProductManager()
const controller = new ProductController()

const productRouter = Router()

productRouter.get('/', async (req, res) => {

    const products = await controller.getProducts()

    res.status(200).send(products)
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

productRouter.post("/", uploader.single("thumbnail"), async (req, res) => {
    try {
        if (!req.file)
          return res
            .status(400)
            .send({ status: "FIL", data: "No se pudo subir el archivo" });
    
        const { title, description, price, code, stock } = req.body;
        if (!title || !description || !price || !code || !stock) {
          return res
            .status(400)
            .send({ status: "ERR", data: "Faltan campos obligatorios" });
        }
    
        const newContent = {
          title,
          description,
          price,
          thumbnail: req.file.filename,
          code,
          stock,
        };
    
        const result = await controller.addProducts(newContent);
    
        res.status(200).send({ status: "OK", data: result });
      } catch (err) {
        res.status(500).send({ status: "ERR", data: err.message });
      }
    });

productRouter.put("/:pid", uploader.single("thumbnail"),async (req, res) => {
    try {
        if (!req.file) {
          delete req.body.thumbnail;
        } else {
          req.body.thumbnail = req.file.filename;
        }
    
        const updatedProduct = await controller.updateProduct(
          req.params.pid,
          req.body
        );
    
        res.status(200).send({ status: "OK", data: updatedProduct });
      } catch (err) {
        res.status(500).send({ status: "ERR", data: err.message });
      }
    });


productRouter.delete("/:pid", async (req, res) => {
    const pid = req.params.pid
    res.status(200).send(await controller.deleteProduct(pid))
})


productRouter.get('/paginated', async (req, res) => {
    try {
        const page = req.query.page || 1
      const limit = req.query.limit || 25
        const products = await controller.getProductsPaginated({ page, limit })
        res.status(200).send({ status: 'success', payload: products })
        
    } catch (error) {
        res.status(500).send({ status: 'error', payload: error.message })
    }
})


export default productRouter