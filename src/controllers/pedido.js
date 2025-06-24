import { validatePedido } from "../schemas/pedido.js";

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
}