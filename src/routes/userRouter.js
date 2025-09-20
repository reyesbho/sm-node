import { Router } from "express"
import { UserController } from "../controllers/userController.js";

export const createUserRouter = ({userModel, rolModel}) => {
    const userRouter = Router();
    const userController = new UserController({userModel, rolModel});
    userRouter.post('/login', userController.login);
    userRouter.post('/register', userController.create);
    userRouter.post('/logout', userController.logout);

    return userRouter;
}