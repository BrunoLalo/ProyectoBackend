import fs from "fs"
import { nanoid } from 'nanoid'

class ProductManager {
    constructor() {
        this.path = `./src/products.json`
        this.products = []
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

        newProduct.id = nanoid()

        if (this.products.some((product) => product.code === code)) {
            console.log("El código del producto ya existe");
            return;
        }
        this.products.push(newProduct)

        // await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        // return "Agregado"
    }

    async getProducts() {
        const respuesta = await fs.promises.readFile(this.path, { encoding: 'utf8' })
        return (JSON.parse(respuesta))
    }

    async getProductById(idProduct) {
        const getId = this.products.find((product) => product.id === idProduct)

        if (getId) {
            console.log(getId)
        } else {
            console.log('Error: not found')
        }
    }

    async exist(id){
        const products = await this.getProducts()
        return products.find(prod => prod.id ===id)
    }

    async updateProduct(id, newData) {
        const respuesta2 = await this.getProducts()

        const updateId = this.respuesta2.findIndex((product) => { return product.id === id })

        if (updateId !== -1) {
            this.products[updateId] = newData
        } else {
            console.log('Error: not found')
        }
        return "Producto actualizado"
    }

    async deleteProduct(idProduct) {
        const respuesta3 = await this.getProducts()

        const deleteId = this.respuesta3.findIndex((product) => { return product.id === idProduct })

        if (deleteId !== -1) {
            this.products.splice(deleteId, 1)
            console.log('Eliminado')
        } else {
            console.log('Error: not found')
        }

        return "Producto eliminado"
    }

}

const manager = new ProductManager()

manager.addProducts('producto prueba 1', 'Este es un producto prueba 1', 200, 'Sin imagen', 'abc123', 25)
manager.addProducts('producto prueba 2', 'Este es un producto prueba 2', 200, 'Sin imagen', 'abc124', 25)
manager.addProducts('producto prueba 3', 'Este es un producto prueba 3', 200, 'Sin imagen', 'abc125', 25)
manager.addProducts('producto prueba 4', 'Este es un producto prueba 4', 200, 'Sin imagen', 'abc126', 25)
manager.addProducts('producto prueba 5', 'Este es un producto prueba 5', 200, 'Sin imagen', 'abc127', 25)
manager.addProducts('producto prueba 6', 'Este es un producto prueba 6', 200, 'Sin imagen', 'abc128', 25)
manager.addProducts('producto prueba 7', 'Este es un producto prueba 7', 200, 'Sin imagen', 'abc129', 25)
manager.addProducts('producto prueba 8', 'Este es un producto prueba 8', 200, 'Sin imagen', 'abc131', 25)
manager.addProducts('producto prueba 9', 'Este es un producto prueba 9', 200, 'Sin imagen', 'abc132', 25)
manager.addProducts('producto prueba 10', 'Este es un producto prueba 10', 200, 'Sin imagen', 'abc134', 25)

export default ProductManager