import ProductMokingRepository from "../repository/mock.repository.js";

const productRepositoryMock = new ProductMokingRepository();

export class ProductMokingService {
    async getAllProductsMoking() {
        return await productRepositoryMock.getAllProductsMoking();
    }

    async getOneProductMoking(_id) {
        return await productRepositoryMock.getOneProductMoking(_id);
    }

    async deleteProductMocking(_id) {
        return await productRepositoryMock.deleteProductMocking(_id);
    }
}