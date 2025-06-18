import { ProductModel } from "../models/Product.js";
import { validateProduct, validatePartialProduct } from '../schemas/product.js';

export class ProductController {
    static async getAll(req, res) {
        const { search } = req.query;
        const products = await ProductModel.getAll({ clave: search });
        return res.json(products);
    }

    static async getById(req, res) {
        const {id} = req.params;  
        const product = await ProductModel.getById({id});
        if (!product) {
            return res.status(422).send({message: 'Product not found'});
        }
         return res.json(product);
    }

    static async create(req, res) {
        const result = validateProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }
        const newProduct = await ProductModel.create(result.data);
        return res.status(201).json(newProduct);
    }

    static async update(req, res) {
        const {id} = req.params;
        const result = validatePartialProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }

        const updateProduct = await ProductModel.update({id, ...result.data});

        if (updateProduct === false) {
            return res.status(404).send({message: 'Product not found'});
        }

        return res.json(updateProduct);
    }   

    static async delete(req, res) {
        const {id} = req.params;
        const result = await ProductModel.delete({id});
        if (result === false) {
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product deleted successfully');
    }
}