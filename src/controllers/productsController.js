import { validateProduct, validatePartialProduct } from '../schemas/productSchema.js';

export class ProductController {
    constructor ({productModel}) {
        this.productModel = productModel;
    }

    getAll = async(req, res) => {
        const { tag, estatus} = req.query;
        const { idCompany } = req.params;
        const products = await this.productModel.getAll({tag, estatus, idCompany});
        return res.json(products);
    }

    getById = async(req, res) => {
        const {idCompany, idProducto} = req.params;  
        const product = await this.productModel.getById({id: idProducto, idCompany});
        if (product == false) {
            return res.status(404).send({message: 'Product not found'});
        }
         return res.json(product);
    }

    create = async(req, res) => {
        const result = validateProduct(req.body);
        const {idCompany} = req.params;
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }
        const newProduct = await this.productModel.create({inputProduct:result.data, idCompany});
        return res.status(201).json(newProduct);
    }

    update = async(req, res) => {
        const {idProducto, idCompany} = req.params;
        const result = validatePartialProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }
        let updateProduct;
        try{
            updateProduct = await this.productModel.update({id: idProducto, idCompany, ...result.data});
            if (updateProduct === false) {
                return res.status(404).send({message: 'Product not found'});
            }   
        }catch(error){
            return res.status(404).send({message: 'Product not found'});
        }

        return res.json(updateProduct);
    }   

    delete = async(req, res) => {
        const {idProducto, idCompany} = req.params;
        const result = await this.productModel.delete({id: idProducto, idCompany});
        if (result === false) {
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product deleted successfully');
    }
    
    updateState = async(req, res) => {
        const {idProducto, idCompany} = req.params;
        const result = await this.productModel.updateState({id: idProducto, idCompany});
        if (result === false) {
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product updated successfully');
    }
}