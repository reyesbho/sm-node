import { Timestamp } from "firebase/firestore";
import { EstatusPedido, PedidoCreateInput, PedidoDB, PedidoUpdateInput, validatePedidoCreate, validatePedidoUpdate } from "../schemas/pedido.js";
import { v4 as uuidv4 } from 'uuid';
import { PedidoModel } from "../models/firebase/Pedido.js";
import { Request, Response } from "express";


export class PedidoController {
    private pedidoModel: PedidoModel;
    constructor({ pedidoModel }: { pedidoModel: PedidoModel }) {
        this.pedidoModel = pedidoModel;
    }

    getAll = async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize, cliente } = req.query;
        const response = await this.pedidoModel.getAll({
            fechaInicio: fechaInicio as string ?? undefined,
            fechaFin: fechaFin as string ?? undefined,
            estatus: estatus as EstatusPedido ?? undefined,
            cursorFechaCreacion: cursorFechaCreacion as string ?? undefined,
            cliente: cliente as string?? undefined,
            pageSize: pageSize as string && !isNaN(Number(pageSize))
                ? Number(pageSize)
                : undefined
        });
        return res.json(response);
    }

    resume = async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin } = req.query;
        const response = await this.pedidoModel.resume(fechaInicio as string ?? undefined,
            fechaFin as string ?? undefined);
        return res.json(response);
    }



    create = async (req: Request, res: Response) => {
        const result = validatePedidoCreate(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const pedido: PedidoCreateInput = { 
            ...result.data,
            registradoPor: req?.session?.email || 'SYSTEM',
            fechaCreacion: Timestamp.fromDate(new Date()),
            clienteLower: result.data.cliente.toLocaleLowerCase()
         } as PedidoDB ;

        pedido.estatus = "TODO";
        pedido.estatusPago = "PENDIENTE";
        const newPedido = await this.pedidoModel.create({ ...pedido });
        return res.status(200).json(newPedido);
    }

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const pedido = await this.pedidoModel.getById({ id: id as string });
        if (!pedido) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.json(pedido);
    }

    update = async (req: Request, res: Response) => {
        const result = validatePedidoUpdate(req.body);
        const {id} = req.params;
        if (result.error) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }
        const pedido: PedidoUpdateInput = { 
            ...result.data,
            actualizadoPor: req?.session?.email || 'SYSTEM',
            fechaActualizacion: Timestamp.fromDate(new Date()),
            clienteLower: result?.data?.cliente?.toLocaleLowerCase()
         } as PedidoDB;
        const updatePedido = await this.pedidoModel.update(id as string, { ...pedido });
        if (!updatePedido) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.json(updatePedido);

    }
}