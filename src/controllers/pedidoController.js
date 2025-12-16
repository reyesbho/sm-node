import { Timestamp } from "firebase/firestore";
import { validatePartialPedido, validatePedido } from "../schemas/pedidoSchema.js";
import { estatusPago, estatusPedido, formateDate } from "../utils/utils.js";
import { v4 as uuidv4 } from 'uuid';
import { id } from "zod/v4/locales";


export class PedidoController {
    constructor({pedidoModel}){
        this.pedidoModel = pedidoModel;
    }

    getAllPublic = async(req, res) => {
        try {
            const {
                fechaInicio,
                fechaFin,
                estatus ='ALL',
                cursorFechaCreacion= null,
                pageSize= 100
            } = req.query;
            
            // Si no se proporcionan fechas, no aplicar filtros de fecha
            const response = await this.pedidoModel.getAll({
                fechaInicio, 
                fechaFin, 
                estatus, 
                cursorFechaCreacion, 
                pageSize
            });
            
            // Remove sensitive information from pedidos
            const pedidosPublic = response.pedidos.map( (pedido) => {
                return {
                    id: pedido.id,
                    fechaEntrega: pedido.fechaEntrega,
                    cliente: pedido.cliente,
                    lugarEntrega: pedido.lugarEntrega
                }
            });
            
            // Return the sanitized pedidos
            return res.json(pedidosPublic);
        } catch (error) {
            console.error('Error in getAllPublic:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    getAll = async(req, res) => {
        const {idCompany} = req.params;
        try {
            const {
                fechaInicio,
                fechaFin,
                estatus ='ALL',
                cursorFechaCreacion= null,
                pageSize= 100
            } = req.query;
            
            const pedidos = await this.pedidoModel.getAll({
                fechaInicio, 
                fechaFin, 
                estatus, 
                cursorFechaCreacion, 
                pageSize,
                idCompany
            });
            return res.json(pedidos);
        } catch (error) {
            console.error('Error in getAll:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    create = async(req, res) => {
        const {idCompany} = req.params;
        const result = validatePedido(req.body);
        if(result.error){
            return res.status(400).json({error: JSON.parse(result.error)})
        }
        const {id, ...dataAux} = result.data;
        dataAux.registradoPor = req.session.user;
        dataAux.fechaCreacion = new Date();
        dataAux.estatus = estatusPedido.BACKLOG;
        dataAux.estatusPago = estatusPago.PENDIENTE;
        dataAux.total = (dataAux.productos ? dataAux.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0) : 0);
        dataAux.fechaEntrega = Timestamp.fromDate(new Date(dataAux.fechaEntrega.seconds * 1000 + dataAux.fechaEntrega.nanoseconds / 1e6));
        dataAux.productos?.forEach(producto => {
           producto.id = uuidv4();
        });
        const newPedido = await this.pedidoModel.create({inputPedido: dataAux, idCompany});
        return res.status(201).json(newPedido);
    }

    getById = async (req, res) => {
        const {idPedido, idCompany} = req.params;
        const pedido = await this.pedidoModel.getById({id:idPedido, idCompany});
        if(pedido == false){
            return res.status(404).send({message: 'Product not found'});
        }
        return res.json(pedido);
    }

    update = async(req, res) => {
        const {idPedido, idCompany} = req.params;
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
        let updatedPedido;
        try{
            updatedPedido = await this.pedidoModel.update({id: idPedido, idCompany, ...dataAux});
            if(updatedPedido == false){
                return res.status(404).send({message:'Product not found'});
            }
        }catch(error){
            return res.status(404).send({message:'Product not found'});
        }
        
        return res.json(updatedPedido);

    }
}