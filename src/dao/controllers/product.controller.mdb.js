import productModel from '../models/product.model.js'


export default class ProductController {
    constructor() {
    }

    async addProducts(product) {
        await productModel.create(product)
        return "Producto agregado"
    }

    async getProducts() {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (err) {
            return err.message
        }

    }
    // async getProducts(page, query, sort) {
    //     try {
            
    //         const products = await productModel.aggregate([
    //             {$match: {page: page}},
    //             {$match: {type: query}},
    //             {$match: {price: sort}}
    //         ])
    //         return products
    //     }
    //      catch (error) {
    //         return error.message
    //     }
    // }

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

    async getProductsPaginated(offset, limit) {
        return await productModel.paginate(
            { stock: 20},
            { offset: offset, limit: limit, lean: true }
        )
    }

}

// const manager = new ProductController()


// const newProduct = {
//     title: 'producto prueba 1',
//     description: 'Este es un producto prueba 1',
//     price: 200,
//     thumbnail: 'Sin imagen',
//     code: 'abc123',
//     stock: 25
// }

// manager.addProducts(newProduct)
