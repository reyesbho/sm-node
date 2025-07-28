import {Router} from 'express';
import { ProductController } from '../controllers/products.js';

export const  createProductRouter = ({productModel}) => {
    const producsRouter = Router();
    const productController = new ProductController({productModel});

    producsRouter.get('/', productController.getAll);
    producsRouter.get('/:id',productController.getById);
    producsRouter.post('/', productController.create);
    producsRouter.patch('/:id', productController.update);
    producsRouter.delete('/:id', productController.delete);
    producsRouter.put('/:id', productController.updateState);

    return producsRouter;
}
