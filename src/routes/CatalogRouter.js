import { Router } from "express"
import { CatalogController } from "../controllers/CatalogController.js";

export const createCatalogRouter = ({catalogModel}) => {
    const catalogRouter = Router({mergeParams: true});
    const catalogController = new CatalogController({catalogModel});

    catalogRouter.get('/', catalogController.getAll);
    catalogRouter.get('/:idCatalog', catalogController.getById);

    return catalogRouter;
}