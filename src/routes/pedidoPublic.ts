import { Router } from "express";
import { PedidoController } from "../controllers/pedido.js";
import { PedidoModel } from "../models/firebase/Pedido.js";

export const createPedidoPublicRouter = ({pedidoModel}:{pedidoModel:PedidoModel}) => {
    const pedidosPublicRouter = Router();
    const pedidoController = new PedidoController({pedidoModel});

    // Public routes for pedidos
    pedidosPublicRouter.get('/', pedidoController.getAllPublic);

    return pedidosPublicRouter;
}