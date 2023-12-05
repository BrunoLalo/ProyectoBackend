import productModel from './models/product.model.js'


export default class ProductController {
    constructor() {
    }

    async addProducts(title, description, price, thumbnail, code, stock) {

        const newProduct = {
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
        }

        await productModel.create(newProduct)

        return 'Agregado'
    }

    async getProducts() {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }
        
    }

    async getProductById(id) {
        const product = await productModel.findById(id)
        return product === null ? 'No se encuentra el producto' : product
    }

    async updateProduct(id, newData) {
        const procedure = await productModel.findByIdAndUpdate(id, newData)
        return procedure
    }

    async deleteProduct(id) {
        const procedure = await productModel.findByIdAndDelete(id)
        return procedure
    }

}

