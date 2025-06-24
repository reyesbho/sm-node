import { Router } from "express";
import { PedidoController } from "../controllers/pedido.js";

export const createPedidoRouter = ({pedidoModel}) => {
    const pedidosRouter = Router();
    const pedidoContoller = new PedidoController({pedidoModel});

    pedidosRouter.get('/', pedidoContoller.getAll);
    pedidosRouter.post('/', pedidoContoller.create);
    
    return pedidosRouter;
}