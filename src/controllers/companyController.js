import { email } from "zod/v4";
import { validateCompany, validatePartialCompany } from "../schemas/companySchema.js";

export class CompanyController{
    constructor({companyModel}){
        this.companyModel = companyModel;
    }

    getAll = async(req ,res) => {
        const {estatus} = req.query;
        const companys = await this.companyModel.getAll({estatus});
        return res.json(companys);               
    }

    getById = async(req, res) => {
        const {id} = req.params;
        const company = await this.companyModel.getById({id});
        if(company == false){
            res.status(400).send({message:'Company not found'});
        }
        return res.json(company);
    }

    create = async(req, res) => {
        //validamos la estructura con el shcema
        const result = validateCompany(req.body);
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)});
        }
        const {id, ...dataAux} = result.data;
        dataAux.fechaCreacion = new Date();
        dataAux.user = {email: req.session?.user};
        console.log(dataAux)
        const newCompany = await this.companyModel.create({inputCompany: dataAux});
        return res.status(201).json(newCompany);
    }

    update = async(req, res) => {
        const {id} = req.params;
        //validamos schema partial 
        const result = validatePartialCompany(req.body);
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)});
        }
        const {...dataAux} = result.data;
        dataAux.fechaActualizacion = new Date();
        let updateCompany;
        try{
            updateCompany = await this.companyModel.update({id, ...dataAux});
        }catch(error){
            return res.status(404).send({message: "Company not found"});
        }
        return res.json(updateCompany);
    }

    updateStatus = async(req, res) => {
        const {id} = req.params;
        const company = await this.companyModel.updateStatus({id});
        if(!company){
            return res.status(404).send({message: 'Company not found'});
        }
        return res.status(204).send({message:'Company update successfully'});
    }


     delete = async(req, res) => {
        const {id} = req.params;
        const result = await this.companyModel.delete({id});
        if (result === false){
            return res.status(404).send({message: 'Company not found'});
        }
        return res.status(204).send({message: 'Company deleted successfully'});
    }
}