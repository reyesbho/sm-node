import { Router } from "express"
import { UserController } from "../controllers/user.js";
import { UserModel } from "../models/firebase/User.js";

export const createUserRouter = ({userModel}:{userModel:UserModel}) => {
    const userRouter = Router();
    const userController = new UserController({userModel});
    userRouter.post('/register', userController.create);
    userRouter.post('/auth', userController.login);

    return userRouter;
}