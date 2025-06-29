import { Router } from "express"
import { UserController } from "../controllers/user.js";

export const createUserRouter = ({userModel}) => {
    const userRouter = Router();
    const userController = new UserController({userModel});

    userRouter.post('/login', userController.login);
    userRouter.post('/register', userController.create);
    userRouter.post('/logout', userController.logout);

    return userRouter;
}