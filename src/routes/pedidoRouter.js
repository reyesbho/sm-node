import { Router } from "express";
import { PedidoController } from "../controllers/pedidoController.js";

export const createPedidoRouter = ({pedidoModel}) => {
    const pedidosRouter = Router({mergeParams: true});
    const pedidoContoller = new PedidoController({pedidoModel});

    pedidosRouter.get('/', pedidoContoller.getAll);
    pedidosRouter.get('/:idPedido', pedidoContoller.getById);
    pedidosRouter.post('/', pedidoContoller.create);
    pedidosRouter.patch('/:idPedido', pedidoContoller.update);
    
    return pedidosRouter;
}