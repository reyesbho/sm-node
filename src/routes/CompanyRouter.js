import { Router } from "express"
import { CompanyController } from "../controllers/companyController.js";

export const createCompanyRouter = ({companyModel}) => {
    const companyRouter = Router();
    const comapanyController = new CompanyController({companyModel});
    companyRouter.get('/', comapanyController.getAll);
    companyRouter.get('/:id', comapanyController.getById);
    companyRouter.post('/', comapanyController.create);
    companyRouter.patch('/:id', comapanyController.update);
    companyRouter.put('/:id', comapanyController.updateStatus);
    companyRouter.delete('/:id', comapanyController.delete);


    return companyRouter;
}