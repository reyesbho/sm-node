import { validateUser } from "../schemas/user.js";

export class UserController {
    constructor({userModel}){
        this.userModel = userModel;
    }

    create = async(req, res) => {
        const result = validateUser(req.body);
        if(result.error){
            return res.status(400).json({message:JSON.parse(result.error.message)});
        }
        try{
            const newUser = await this.userModel.create({inputUser: result.data});
            return res.json(newUser);
        }catch(error){
            res.status(400).json({message: error.message});
        }
        
    }

    login = async (req, res) => {
        const result = validateUser(req.body);
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)});
        }
        const user = await this.userModel.login({inputUser: result.data});
        if(user == false){
            res.status(401).json({message:"Authentication failed"});
        }
        const access_token = await user.getIdToken();
        const refresh_token = await user.refreshToken;
        return res.status(200)
                .cookie('access_token', access_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? none : 'lax'),
                    maxAge: 1000 * 60 * 60
                } )
                .cookie('refresh_token', refresh_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? none : 'lax'),
                    maxAge: 1000 * 60 * 60 * 12
                } )
                .json({token: access_token});
    }

    logout = async(req, res) => {
        const  logout = await this.userModel.logout();
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        if(logout == false){
            return res.status(401).json({message:"Error al deslogearse"});
        }
        return res.status(200).json({message: 'Succefull logout'});
    }
}