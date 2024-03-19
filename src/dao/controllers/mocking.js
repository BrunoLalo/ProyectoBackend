import { randomUUID } from "node:crypto";
import { faker } from '@faker-js/faker'

const mockProducts = []
for (let i = 0; i < 100; i++) {
  mockProducts.push({
    _id: { randomUUID },
    product: faker.commerce.product(),
    productAdjective: faker.commerce.productAdjective(),
    productMaterial: faker.commerce.productMaterial(),
    price: faker.commerce.price(),
  })
}

export default class ProductMocking {
    async getAllProductsMoking() {
        return await mockProducts.findMany().lean();
    }

    async getOneProductMoking(_id) {
        return await mockProducts.findOne(_id).lean();
    }

    async deleteProductMocking(_id) {
        const deletedProduct = await mockProducts.findByIdAndDelete(id).lean();
        if (!deletedProduct) {
            throw new Error(`Producto no encontrado`);
        }
        return deletedProduct;
    }
}