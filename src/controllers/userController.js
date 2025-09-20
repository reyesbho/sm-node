import { validateUser } from "../schemas/userSchema.js";
import { ROL_CONSTANT } from "../utils/Rol.utils.js";

export class UserController {
    constructor({userModel, rolModel}){
        this.userModel = userModel;
        this.rolModel = rolModel;
    }

    create = async(req, res) => {
        const result = validateUser(req.body);
        if(result.error){
            return res.status(400).json({message:JSON.parse(result.error.message)});
        }
        try{
            const rol = await this.rolModel.getByClave({clave: ROL_CONSTANT.USUARIO});
            const newUser = await this.userModel.create({inputUser: result.data, rol});
            return res.json(newUser);
        }catch(error){
            console.log(error)
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
            return res.status(401).json({message:"Authentication failed"});
        }
        const access_token = await user.getIdToken();
        const refresh_token = await user.refreshToken;
        return res.status(200)
                .cookie('access_token', access_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? 'None' : 'lax'),
                    maxAge: 1000 * 60 * 60
                } )
                .cookie('refresh_token', refresh_token,{
                    httpOnly:true,
                    secure:process.env.NODE_ENV == 'production',
                    sameSite:(process.env.NODE_ENV == 'production' ? 'None' : 'lax'),
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

    delete = async(req, res) =>{
        const {id} = req.params;  
        const userDelete = await this.userModel.delete({uid: id});
        if(!userDelete){
            return res.status(401).json({message:"Error al eliminar el usuario"});
        }
        return res.status(204).json("Usuario eliminado correctamente");
    }
}