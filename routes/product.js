import {Router} from 'express';
import { ProductController } from '../controllers/products.js';

export const producsRouter = Router();

producsRouter.get('/', ProductController.getAll);
producsRouter.get('/:id',ProductController.getById);
producsRouter.post('/', ProductController.create);
producsRouter.patch('/:id', ProductController.update);
producsRouter.delete('/:id', ProductController.delete);
