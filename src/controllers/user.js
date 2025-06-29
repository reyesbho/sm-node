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
        const newUser = await this.userModel.create({inputUser: result.data});
        return res.json(newUser);
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
        return res.status(200).json({message: 'Succefull authentication'});
    }

    logout = async(req, res) => {
        const  logout = await this.userModel.logout();
        if(logout == false){
            return res.status(401).json({message:"Error al deslogearse"});
        }
        return res.status(200).json({message: 'Succefull logout'});
    }
}