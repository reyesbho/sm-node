import { Router } from "express";
import { PedidoController } from "../controllers/pedido.js";

export const createPedidoPublicRouter = ({pedidoModel}) => {
    const pedidosPublicRouter = Router();
    const pedidoController = new PedidoController({pedidoModel});

    // Public routes for pedidos
    pedidosPublicRouter.get('/', pedidoController.getAllPublic);

    return pedidosPublicRouter;
}