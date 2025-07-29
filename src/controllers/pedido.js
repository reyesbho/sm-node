import { Timestamp } from "firebase/firestore";
import { validatePartialPedido, validatePedido } from "../schemas/pedido.js";
import { estatusPago, estatusPedido } from "../utils/utils.js";
import { v4 as uuidv4 } from 'uuid';


export class PedidoController {
    constructor({pedidoModel}){
        this.pedidoModel = pedidoModel;
    }

    getAll = async(req, res) => {
        const {fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize} = req.query;
        const pedidos =  await this.pedidoModel.getAll({fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize});
        return res.json(pedidos);
    }

    create = async(req, res) => {
        const result = validatePedido(req.body);
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)})
        }
        const {id, ...dataAux} = result.data;
        dataAux.registradoPor = req.session.user;
        dataAux.fechaCreacion = new Date();
        dataAux.estatus = estatusPedido.INCOMPLETE;
        dataAux.estatusPago = estatusPago.PENDIENTE;
        dataAux.total = (dataAux.productos ? dataAux.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0) : 0);
        dataAux.fechaEntrega = Timestamp.fromDate(new Date(dataAux.fechaEntrega.seconds * 1000 + dataAux.fechaEntrega.nanoseconds / 1e6));
        dataAux.productos?.forEach(producto => {
           producto.id = uuidv4();
        });
        const newPedido = await this.pedidoModel.create({inputPedido: dataAux});
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
        const {fechaCreacion, ...dataAux} = result.data;
        if(dataAux.fechaEntrega !== undefined)
            dataAux.fechaEntrega = Timestamp.fromDate(new Date(dataAux.fechaEntrega.seconds * 1000 + dataAux.fechaEntrega.nanoseconds / 1e6));
        if(dataAux.productos !== undefined)
            dataAux.total =  dataAux.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
        dataAux.registradoPor = req.session.user;
        dataAux.productos?.forEach(producto => {
            if(producto.id === undefined || producto.id === null){
                producto.id = uuidv4();
            }
        });
        const updatePedido = await this.pedidoModel.update({id, ...dataAux});
        if(updatePedido == false){
            return res.status(404).send({message:'Product not found'});
        }
        return res.json(updatePedido);

    }
}