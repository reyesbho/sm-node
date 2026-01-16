import { Request, Response, response } from "express";
import { seedPedido, seedProducts } from "../data/seed.js";
import { PedidoModel } from "../models/firebase/Pedido.js";
import { ProductModel } from "../models/firebase/Product.js";

export class SeedController {
    private productModel: ProductModel;
    private pedidoModel: PedidoModel;
    constructor({ productModel, pedidoModel }: { productModel: ProductModel, pedidoModel: PedidoModel }) {
        this.productModel = productModel;
        this.pedidoModel = pedidoModel;
    }

    seed = async(req:Request, res:Response) =>{
        const productsSeed = seedProducts;
        const promiseProducts = productsSeed.map(async(product) => await this.productModel.create({...product}));

        const pedidosSeed = seedPedido;
        const promisePedidos = pedidosSeed.map(async(pedido) => await this.pedidoModel.create({...pedido}));

        await Promise.all([...promisePedidos, ...promiseProducts]);
        return res.status(200).json({message:'Success seed'});
    }
}