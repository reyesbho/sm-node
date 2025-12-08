import {Router} from 'express';
import { ProductController } from '../controllers/productsController.js';

export const  createProductRouter = ({productModel}) => {
    const producsRouter = Router({mergeParams: true});
    const productController = new ProductController({productModel});

    producsRouter.get('/', productController.getAll);
    producsRouter.get('/:idProducto',productController.getById);
    producsRouter.post('/', productController.create);
    producsRouter.patch('/:idProducto', productController.update);
    producsRouter.delete('/:idProducto', productController.delete);
    producsRouter.put('/:idProducto', productController.updateState);

    return producsRouter;
}
