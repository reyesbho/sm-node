import { Request, Response } from "express";
import { UserModel } from "../models/firebase/User.js";
import { validateUser } from "../schemas/user.js";
import { validateLogin } from "../schemas/login.js";


export class UserController {
    private userModel: UserModel;
    constructor({ userModel }: { userModel: UserModel }) {
        this.userModel = userModel;
    }

    create = async (req:Request, res:Response) => {
        const {error, data} = validateUser(req.body);
        if (error) {
            return res.status(400).json({ message: JSON.parse(error.message) });
        }
        try {
            const newUser = await this.userModel.create();
            return res.json(newUser);
        } catch (error:any) {
            res.status(400).json({ message: error.message });
        }
    }

     login = (req:Request, res:Response) => {
        const result = validateLogin(req.body);
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)});
        }
        const access_token =  result.data.idToken;
        const refresh_token = result.data.refreshToken;

        return res.status(200)
                .cookie('access_token', access_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? 'none' : 'lax'),
                    maxAge: 1000 * 60 * 60
                } )
                .cookie('refresh_token', refresh_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? 'none' : 'lax'),
                    maxAge: 1000 * 60 * 60 * 12
                } ).json({message: 'success auth'});
    }
}