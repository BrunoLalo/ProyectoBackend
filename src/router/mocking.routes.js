import {Router} from 'express'
import { ProductMokingService } from "../services/mocking.service.js";

const mockRouter = Router()
const productMock = new ProductMokingService();

mockRouter.get('/', async (req, res) => {
    try {
        const prd = await productMock.getAllProductsMoking();
        res.successfullGet(prd);
    } catch (error) {
        res.serverError(`Error al recibir el producto `);
    }
})

mockRouter.get('/', async (req, res) => {
    
    const id = parseInt(req.params.id);    
    try {
        const prdId = await productMock.getOneProductMoking(id);
        res.successfullGet(prdId);
    } catch (error) {
         res.serverError(`Error al recibir el producto con Id ${id}`);
    }

})

export default mockRouter