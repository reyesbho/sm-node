import { validatePartialPedido, validatePedido } from "../schemas/pedido.js";

export class PedidoController {
    constructor({pedidoModel}){
        this.pedidoModel = pedidoModel;
    }

    getAll = async(req, res) => {
        const {fechaInicio, fechaFin, estatus, pagina, sizePagina} = req.query;
        const pedidos =  await this.pedidoModel.getAll({fechaInicio, fechaFin, estatus, pagina, sizePagina});
        return res.json(pedidos);
    }

    create = async(req, res) => {
        const result = validatePedido(req.body);
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)})
        }
        const newPedido = await this.pedidoModel.create({inputPedido: result.data});
        return res.status(200).json(newPedido);
    }

    getById = async (req, res) => {
        const {id} = req.params;
        const pedido = await this.pedidoModel.getById({id});
        if(pedido == false){
            return res.status(422).send({message: 'Product not found'});
        }
        return res.json(pedido);
    }

    update = async(req, res) => {
        const {id} = req.params;
        const result = validatePartialPedido(req.body);
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)});
        }
        const updatePedido = await this.pedidoModel.update({id, ...result.data});
        if(updatePedido == false){
            return res.status(404).send({message:'Product not found'});
        }
        return res.json(updatePedido);

    }
}