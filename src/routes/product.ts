import {Router} from 'express';
import { ProductController } from '../controllers/products.js';
import { ProductModel } from '../models/firebase/Product.js';

export const  createProductRouter = ({productModel}:{productModel:ProductModel}) => {
    const producsRouter = Router();
    const productController = new ProductController({productModel});

    producsRouter.get('/', productController.getAll);
    producsRouter.get('/:id',productController.getById);
    producsRouter.post('/', productController.create);
    producsRouter.patch('/', productController.update);
    producsRouter.delete('/:id', productController.delete);

    return producsRouter;
}
