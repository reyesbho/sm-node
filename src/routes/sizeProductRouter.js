import { Router } from "express";
import { SizeProductController } from "../controllers/sizeProductController.js";
export const createSizeProductRouter = ({ sizeProductModel }) => {
    const sizeProductRouter = Router({mergeParams: true});
    const sizeProductController = new SizeProductController({ sizeProductModel });

    sizeProductRouter.get("/", sizeProductController.getAll);
    sizeProductRouter.get("/:id", sizeProductController.getById);
    sizeProductRouter.post("/", sizeProductController.create);
    sizeProductRouter.patch("/:id", sizeProductController.update);
    sizeProductRouter.put("/:id", sizeProductController.updateState);
    sizeProductRouter.delete("/:id", sizeProductController.delete);

    return sizeProductRouter;
};
