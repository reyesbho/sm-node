import { email } from "zod/v4";
import { validateCompany, validatePartialCompany } from "../schemas/companySchema.js";
import { id } from "zod/v4/locales";

export class CompanyController {
    constructor({ companyModel }) {
        this.companyModel = companyModel;
    }

    
    validateOwnCompany = async(idCompany) => {
        const company = await this.companyModel.getById({ id: idCompany });
        if (company == false) {
            returnres.status(400).send({ message: 'Company not found' });
        }
        if (company.user.email !== req.session?.user) {
            return res.status(400).send({ message: 'Company not found' });
        }
    }

    getAll = async (req, res) => {
        const { estatus } = req.query;
        const user = req.session?.user;
        const companys = await this.companyModel.getAll({ estatus, user });
        return res.json(companys);
    }

    getById = async (req, res) => {
        const { idCompany } = req.params;
        const company = await this.companyModel.getById({ id: idCompany });
        if (company == false) {
            return res.status(400).send({ message: 'Company not found' });
        }
        if (company.user.email !== req.session?.user) {
            return res.status(400).send({ message: 'Company not found' });
        }
        return res.json(company);
    }

    create = async (req, res) => {
        //validamos la estructura con el shcema
        const result = validateCompany(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error) });
        }
        
        const { id, ...dataAux } = result.data;
        dataAux.fechaCreacion = new Date();
        dataAux.user = { email: req.session?.user };
        dataAux.estatus = true;
        const newCompany = await this.companyModel.create({ inputCompany: dataAux });
        return res.status(201).json(newCompany);
    }

    update = async (req, res) => {
        const { idCompany } = req.params;
        //validamos schema partial 
        const result = validatePartialCompany(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error) });
        }    
        const company = await this.companyModel.getById({ id: idCompany });
        if (company == false) {
            return res.status(400).send({ message: 'Company not found' });
        }
        if (company.user.email !== req.session?.user) {
            return res.status(400).send({ message: 'Company not found' });
        }
        const { ...dataAux } = result.data;
        dataAux.fechaActualizacion = new Date();
        let updateCompany;
        try {
            updateCompany = await this.companyModel.update({ id: idCompany, ...dataAux });
        } catch (error) {
            return res.status(404).send({ message: "Company not found" });
        }
        return res.json(updateCompany);
    }

    updateStatus = async (req, res) => {
        const { idCompany } = req.params;    
        const company = await this.companyModel.getById({ id: idCompany });
        if (company == false) {
            return res.status(400).send({ message: 'Company not found' });
        }
        if (company.user.email !== req.session?.user) {
            return res.status(400).send({ message: 'Company not found' });
        }
        const companyUpdate = await this.companyModel.updateStatus({ id: idCompany });
        if (!company) {
            return res.status(404).send({ message: 'Company not found' });
        }
        return res.json(companyUpdate);
    }


    delete = async (req, res) => {
        const { idCompany } = req.params;    
        const company = await this.companyModel.getById({ id: idCompany });
        if (company == false) {
            return res.status(400).send({ message: 'Company not found' });
        }
        if (company.user.email !== req.session?.user) {
            return res.status(400).send({ message: 'Company not found' });
        }
        const result = await this.companyModel.delete({ id: idCompany });
        if (result === false) {
            return res.status(404).send({ message: 'Company not found' });
        }
        return res.status(204).send({ message: 'Company deleted successfully' });
    }

}