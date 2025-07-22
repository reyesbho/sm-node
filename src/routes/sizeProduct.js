import { Router } from "express";
import { SizeProductController } from "../controllers/sizeProduct.js";
export const createSizeProductRouter = ({ sizeProductModel }) => {
    const sizeProductRouter = Router();
    const sizeProductController = new SizeProductController({ sizeProductModel });

    sizeProductRouter.get("/", sizeProductController.getAll);
    sizeProductRouter.get("/:id", sizeProductController.getById);
    sizeProductRouter.post("/", sizeProductController.create);
    sizeProductRouter.patch("/:id", sizeProductController.update);
    sizeProductRouter.put("/:id", sizeProductController.updateState);

    return sizeProductRouter;
};
