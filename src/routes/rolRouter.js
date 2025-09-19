import { Router } from "express";
import { RolController } from "../controllers/rolController";

export const createRolRouter = ({rolModel}) => {
    const rolRouter = Router();
    const rolController = new RolController({rolModel});
    rolRouter.get('/', rolController.getAll);
    rolRouter.get('/:id', rolController.getById);
    rolRouter.post('/', rolController.create);
    rolRouter.patch('/:id', rolController.update);
    rolRouter.delete('/:id', rolController.delete);
    return rolRouter;
}
