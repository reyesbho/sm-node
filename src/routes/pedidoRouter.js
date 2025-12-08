import { Router } from "express";
import { PedidoController } from "../controllers/pedidoController.js";

export const createPedidoRouter = ({pedidoModel}) => {
    const pedidosRouter = Router({mergeParams: true});
    const pedidoContoller = new PedidoController({pedidoModel});

    pedidosRouter.get('/', pedidoContoller.getAll);
    pedidosRouter.get('/:id', pedidoContoller.getById);
    pedidosRouter.post('/', pedidoContoller.create);
    pedidosRouter.patch('/:id', pedidoContoller.update);
    
    return pedidosRouter;
}