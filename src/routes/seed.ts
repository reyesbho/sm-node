import { Router } from "express"
import { PedidoModel } from "../models/firebase/Pedido.js";
import { ProductModel } from "../models/firebase/Product.js";
import { SeedController } from "../controllers/seed.js";
import { CategoryModel } from "../models/firebase/Category.js";

export const createSeedRouter = (pedidoModel: PedidoModel, productModel: ProductModel, categoryModel: CategoryModel) => {
    const seedRouter = Router();
    const seedController = new SeedController({
        pedidoModel, productModel,categoryModel
    });

    seedRouter.post('/', seedController.seed);
    return seedRouter;
}