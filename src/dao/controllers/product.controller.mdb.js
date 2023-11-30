import productModel from './models/product.model.js'


export default class ProductController {
    constructor() {
    }

    async addProducts(title, description, price, thumbnail, code, stock) {

        let newProduct = {
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
        const respuesta = await productModel.find().lean()
        return respuesta
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