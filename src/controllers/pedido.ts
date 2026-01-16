import { Timestamp } from "firebase/firestore";
import { EstatusPedido, Pedido, validatePartialPedido, validatePedido } from "../schemas/pedido.js";
import { v4 as uuidv4 } from 'uuid';
import { PedidoModel } from "../models/firebase/Pedido.js";
import { Request, Response } from "express";


export class PedidoController {
    private pedidoModel: PedidoModel;
    constructor({ pedidoModel }: { pedidoModel: PedidoModel }) {
        this.pedidoModel = pedidoModel;
    }

    getAllPublic = async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize } = req.query;
        const response = await this.pedidoModel.getAll({
            fechaInicio: fechaInicio as string ?? undefined,
            fechaFin: fechaFin as string ?? undefined,
            estatus: estatus as EstatusPedido ?? undefined,
            cursorFechaCreacion: cursorFechaCreacion as string ?? undefined,
            pageSize: pageSize as string  && !isNaN(Number(pageSize))
                ? Number(pageSize)
                : undefined
        });
        // Remove sensitive information from pedidos
        const pedidosPublic = response.pedidos.map((pedido) => {
            return {
                id: pedido.id,
                fechaEntrega: pedido.fechaEntrega,
                cliente: pedido.cliente,
                lugarEntrega: pedido.lugarEntrega
            }
        });
        console.log(pedidosPublic)
        // Return the sanitized pedidos
        return res.json(pedidosPublic);
    }

    getAll = async (req: Request, res: Response) => {
        const { fechaInicio, fechaFin, estatus, cursorFechaCreacion, pageSize } = req.query;
        const response = await this.pedidoModel.getAll({
            fechaInicio: fechaInicio as string ?? undefined,
            fechaFin: fechaFin as string ?? undefined,
            estatus: estatus as EstatusPedido ?? undefined,
            cursorFechaCreacion: cursorFechaCreacion as string ?? undefined,
            pageSize: pageSize as string  && !isNaN(Number(pageSize))
                ? Number(pageSize)
                : undefined
        });

        console.log(response)
        return res.json(response);
    }

    create = async (req: Request, res: Response) => {
        const result = validatePedido(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const pedido: Pedido = { ...result.data } as unknown as Pedido;
        pedido.registradoPor = req?.session?.email || 'SYSTEM';
        pedido.fechaCreacion = Timestamp.fromDate(new Date());
        pedido.estatus = "BACKLOG";
        pedido.estatusPago = "PENDIENTE";
        pedido.total = (pedido.productos ? pedido.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0) : 0);
        pedido.fechaEntrega = Timestamp.fromDate(new Date(pedido.fechaEntrega.seconds * 1000 + pedido.fechaEntrega.nanoseconds / 1e6));
        pedido.productos?.forEach(producto => {
            producto.id = uuidv4();
        });
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
        const result = validatePartialPedido(req.body);
        if (result.error) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }
        const pedido: Pedido = { ...result.data } as unknown as Pedido;
        if (pedido.fechaEntrega !== undefined)
            pedido.fechaEntrega = Timestamp.fromDate(new Date(pedido.fechaEntrega.seconds * 1000 + pedido.fechaEntrega.nanoseconds / 1e6));
        if (pedido.productos !== undefined)
            pedido.total = pedido.productos?.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0) || 0;
        pedido.registradoPor = req.session?.email || 'system';
        pedido.productos?.forEach(producto => {
            if (producto.id === undefined || producto.id === null) {
                producto.id = uuidv4();
            }
        });
        const updatePedido = await this.pedidoModel.update({ ...pedido });
        if (!updatePedido) {
            return res.status(404).send({ message: 'Product not found' });
        }
        return res.json(updatePedido);

    }
}