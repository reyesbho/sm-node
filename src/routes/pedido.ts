import { Router } from "express";
import { PedidoController } from "../controllers/pedido.js";
import { PedidoModel } from "../models/firebase/Pedido.js";

export const createPedidoRouter = ({pedidoModel}:{pedidoModel:PedidoModel}) => {
    const pedidosRouter = Router();
    const pedidoContoller = new PedidoController({pedidoModel});

    pedidosRouter.get('/', pedidoContoller.getAll);
    pedidosRouter.get('/resume', pedidoContoller.resume);
    pedidosRouter.get('/:id', pedidoContoller.getById);
    pedidosRouter.post('/', pedidoContoller.create);
    pedidosRouter.patch('/', pedidoContoller.update);
    
    return pedidosRouter;
}