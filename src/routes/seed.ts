import { Router } from "express"
import { PedidoModel } from "../models/firebase/Pedido.js";
import { ProductModel } from "../models/firebase/Product.js";
import { SeedController } from "../controllers/seed.js";

export const createSeedRouter = (pedidoModel: PedidoModel, productModel: ProductModel) => {
    const seedRouter = Router();
    const seedController = new SeedController({
        pedidoModel, productModel
    });

    seedRouter.post('/', seedController.seed);
    return seedRouter;
}