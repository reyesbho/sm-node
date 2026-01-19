import { Request, Response, response } from "express";
import { seedCategories, seedPedido, seedProducts } from "../data/seed.js";
import { PedidoModel } from "../models/firebase/Pedido.js";
import { ProductModel } from "../models/firebase/Product.js";
import { CategoryModel } from "../models/firebase/Category.js";

export class SeedController {
    private productModel: ProductModel;
    private pedidoModel: PedidoModel;
    private categoryModel: CategoryModel;
    constructor({ productModel, pedidoModel, categoryModel }: { productModel: ProductModel, pedidoModel: PedidoModel, categoryModel: CategoryModel }) {
        this.productModel = productModel;
        this.pedidoModel = pedidoModel;
        this.categoryModel = categoryModel;
    }

    seed = async(req:Request, res:Response) =>{
        const promiseProducts = seedProducts.map(async(product) => await this.productModel.create({...product}));
        const promisePedidos = seedPedido.map(async(pedido) => await this.pedidoModel.create({...pedido}));
        const promiseCategories = seedCategories.map(async(category) => await this.categoryModel.create({...category}));

        await Promise.all([...promisePedidos, ...promiseProducts, ...promiseCategories]);
        return res.status(200).json({message:'Success seed'});
    }
}