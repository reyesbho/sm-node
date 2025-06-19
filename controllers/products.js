import { validateProduct, validatePartialProduct } from '../schemas/product.js';

export class ProductController {
    constructor ({productModel}) {
        this.productModel = productModel;
    }

    getAll = async(req, res) => {
        const { tag } = req.query;
        const products = await this.productModel.getAll({tag });
        return res.json(products);
    }

    getById = async(req, res) => {
        const {id} = req.params;  
        const product = await this.productModel.getById({id});
        if (!product) {
            return res.status(422).send({message: 'Product not found'});
        }
         return res.json(product);
    }

    create = async(req, res) => {
        const result = validateProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }
        const newProduct = await this.productModel.create(result.data);
        return res.status(201).json(newProduct);
    }

    update = async(req, res) => {
        const {id} = req.params;
        const result = validatePartialProduct(req.body);
        if (result.error) {
            return res.status(400).json({error:JSON.parse(result.error.message)});
        }

        const updateProduct = await this.productModel.update({id, ...result.data});

        if (updateProduct === false) {
            return res.status(404).send({message: 'Product not found'});
        }

        return res.json(updateProduct);
    }   

    delete = async(req, res) => {
        const {id} = req.params;
        const result = await this.productModel.delete({id});
        if (result === false) {
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product deleted successfully');
    }
}