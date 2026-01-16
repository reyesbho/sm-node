import { Request, Response } from 'express';
import { ProductModel } from '../models/firebase/Product.js';
import { validateProduct, validatePartialProduct, Producto } from '../schemas/product.js';

export class ProductController {
    private productModel:ProductModel;
    constructor ({productModel}:{productModel:ProductModel}) {
        this.productModel = productModel;
    }

    getAll = async(req:Request, res:Response) => {
        const { tag, estatus } = req.query;
        const products = await this.productModel.getAll({tag: tag as string, estatus: estatus as string });
        return res.json(products);
    }

    getById = async(req:Request, res:Response) => {
        const {id} = req.params;  
        const product = await this.productModel.getById({id: id as string});
        if (!product) {
            return res.status(404).send({message: 'Product not found'});
        }
         return res.json(product);
    }

    create = async(req:Request, res:Response) => {
        const result = validateProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }
        const newProduct = await this.productModel.create({...result.data} as Producto);
        return res.status(201).json(newProduct);
    }

    update = async(req:Request, res:Response) => {
        const result = validatePartialProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }

        const updateProduct = await this.productModel.update({...result.data});

        if (!updateProduct) {
            return res.status(404).send({message: 'Product not found'});
        }

        return res.json(updateProduct);
    }   

    delete = async(req:Request, res:Response) => {
        const {id} = req.params;
        const result = await this.productModel.delete({id: id as string});
        if (result === false) {
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product deleted successfully');
    }
}