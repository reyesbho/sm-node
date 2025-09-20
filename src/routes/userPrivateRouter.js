import { Router } from "express"
import { UserController } from "../controllers/userController.js";

export const createUserPrivateRouter = ({userModel}) => {
    const userRouter = Router();
    const userController = new UserController({userModel});
    userRouter.delete('/:id', userController.delete);
    return userRouter;
}