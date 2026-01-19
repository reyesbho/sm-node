import { Router } from "express";
import { CategoryController } from "../controllers/category.js";
import { CategoryModel } from "../models/firebase/Category.js";

export const createCategoryRouter = ({ categoryModel }: { categoryModel: CategoryModel }) => {
    const categoryRouter = Router();
    const categoryController = new CategoryController({ categoryModel });

    categoryRouter.get('/', categoryController.getAll);
    categoryRouter.post('/', categoryController.create);
    categoryRouter.delete('/:id', categoryController.delete);
    return categoryRouter;
}