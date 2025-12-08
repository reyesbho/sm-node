import { Router } from "express"
import { CompanyController } from "../controllers/companyController.js";
import { createProductRouter } from "./productRouter.js";
import { createSizeProductRouter } from "./sizeProductRouter.js";
import { createPedidoRouter } from "./pedidoRouter.js";

export const createCompanyRouter = ({companyModel, productModel, sizeProductModel, pedidoModel}) => {
    const companyRouter = Router({mergeParams: true});
    const companyController = new CompanyController({companyModel});

    companyRouter.get('/', companyController.getAll);
    companyRouter.get('/:idCompany', companyController.getById);
    companyRouter.post('/', companyController.create);
    companyRouter.patch('/:idCompany', companyController.update);
    companyRouter.put('/:idCompany', companyController.updateStatus);
    companyRouter.delete('/:idCompany', companyController.delete);

    companyRouter.use('/:idCompany/productos', createProductRouter({productModel}));
    companyRouter.use('/:idCompany/sizesProducts', createSizeProductRouter({sizeProductModel}));
    companyRouter.use('/:idCompany/pedidos', createPedidoRouter({pedidoModel}));

    return companyRouter;
}