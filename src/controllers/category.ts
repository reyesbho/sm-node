import { Request, Response } from "express";
import { CategoryModel } from "../models/firebase/Category.js";
import { Category, validateCategory } from "../schemas/category.js";

export class CategoryController {
    private categoryModel: CategoryModel;
    constructor({categoryModel}:{categoryModel:CategoryModel}){
        this.categoryModel = categoryModel;
    }    

    getAll = async(req: Request, res:Response) => {
        const response = await this.categoryModel.getAll();
        return res.json(response);
    }

    create = async(req: Request, res:Response) => {
        const resultValidation = validateCategory(req.body);
        if(resultValidation.error){
            return res.status(400).json({error: JSON.parse(resultValidation.error.message)});
        }
        const category: Category ={...resultValidation.data} as Category;
        const newPedido = await this.categoryModel.create(category);
        return res.status(200).json(newPedido);
    }

    delete = async(req:Request, res:Response) => {
        const {id} = req.params;
        const result = await this.categoryModel.delete({id: id as string});
        if(result === false){
            return res.status(404).send({message: 'Product not found'});
        }
        return res.status(204).send('Product delete successfully');
    }

    
}