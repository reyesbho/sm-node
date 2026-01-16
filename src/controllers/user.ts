import { Request, Response } from "express";
import { UserModel } from "../models/firebase/User.js";
import { validateUser } from "../schemas/user.js";
import { validateLogin } from "../schemas/login.js";
import { authAdmin } from "../server.js";


export class UserController {
    private userModel: UserModel;
    constructor({ userModel }: { userModel: UserModel }) {
        this.userModel = userModel;
    }

    create = async (req: Request, res: Response) => {
        const { error, data } = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: JSON.parse(error.message) });
        }
        try {
            const newUser = await this.userModel.create();
            return res.json(newUser);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    login = async (req: Request, res: Response) => {
        const result = validateLogin(req.body);
        if (result.error) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }
        const access_token = result.data.idToken;
        const expiresIn = 60 * 60 * 1000;
        const sessionCookie = await authAdmin.createSessionCookie(access_token, { expiresIn });
        return res.status(200)
            .cookie('access_token', sessionCookie, {
                httpOnly: true,
                secure: process.env.NODE_ENV == 'production',
                sameSite: (process.env.NODE_ENV == 'production' ? 'none' : 'lax'),
                maxAge: 1000 * 60 * 60
            }).json({message: 'success auth'});;
    }
}