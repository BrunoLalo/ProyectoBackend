import ProductMocking from "../dao/controllers/mocking.js";

const productDaoMock = new ProductMocking();

export default class ProductMokingRepository {
    async getAllProductsMoking() {
        return await productDaoMock.getAllProductsMoking();
    }

    async getOneProductMoking(_id) {
        return await productDaoMock.getOneProductMoking(_id);
    }

    async deleteProductMocking(_id) {
        return await productDaoMock.deleteProductMocking(_id);
    }
}