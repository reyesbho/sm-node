import { validatePartialRol, validateRol } from "../schemas/rolSchema";

export class RolController {
    constructor({rolModel}){
        this.rolModel = rolModel;
    }

    getAll = async(req, res) => {
        const roles =  await this.rolModel.getAll();
        return res.json(roles);
    }

    create = async(req, res) => {
        const result = validateRol(req.body);  
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)})
        }
        const {id, ...dataAux} = result.data;
        const newRol = await this.rolModel.create({inputRol: dataAux});
        return res.status(201).json(newRol);
    }   

    getById = async (req, res) => {
        const {id} = req.params;
        const rol = await this.rolModel.getById({id});
        if(rol == false){
            return res.status(404).send({message: 'Role not found'});
        }
        return res.json(rol);
    }

    update = async(req, res) => {
        const {id} = req.params;
        const result = validatePartialRol(req.body);
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)});
        }
        const dataAux = result.data;
        const updateRol = await this.rolModel.update({id, ...dataAux});
        if(updateRol == false){
            return res.status(404).send({message:'Role not found'});
        }
        return res.json(updateRol);
    }

    delete = async(req, res) => {
        const {id} = req.params;
        const deleteRol = await this.rolModel.delete({id});
        if(deleteRol == false){
            return res.status(404).send({message:'Role not found'});
        }   
        return res.status(204).json({message: 'Role deleted successfully'});
    }
}