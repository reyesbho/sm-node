import {object, date, number, string, boolean, z} from 'zod';
import { optional } from 'zod/v4';
import { Producto, SizeTag } from './product.js';

const timestampSchema = object({
  seconds: number().int().nonnegative(),
  nanoseconds: number().int().min(0).max(999_999_999),
});

export const pedidoSchema = object({
    fechaEntrega: timestampSchema,
    lugarEntrega: string().optional(),
    cliente: string().min(5, 'Min character length is 5'),
    productos: object({
        cantidad: number().int().positive('Quantity must be a positive integer'),
        size:string().optional(),
        producto: object({
            descripcion: string().min(3, 'Min caracter length is 3'),
            imagen: string().optional()
        }),
        caracteristicas: string().array().optional(),
        precio: number().positive('Price must be a positive number').default(0),
    }).array().optional(),
}).passthrough();

export interface DateTimeFirestore{
    seconds:number,
    nanoseconds: number
}

export type EstatusPedido = 'BACKLOG' | 'DONE' | 'TODO' | 'CANCELED' | 'DELETE';
export type EstatusPago = 'PENDIENTE' | 'PAGADO' | 'ABONADO';

export interface Pedido{
    id:string,
    fechaEntrega: DateTimeFirestore,
    lugarEntrega:string | null,
    cliente:string,
    productos:ProductoPedido[] | null,
    fechaActualizacion: DateTimeFirestore,
    estatus: EstatusPedido,
    registradoPor: string,
    fechaCreacion: DateTimeFirestore,
    estatusPago:EstatusPago,
    total: number,
    abonado?:number
}

export interface ProductoPedido{
    id:string,
    cantidad: number,
    size: SizeTag,
    producto: Producto,
    caracteristicas: string[]
    precio:number
}

export function validatePedido(pedido: Pedido) {
    return pedidoSchema.safeParse(pedido);
}

export function validatePartialPedido(pedido: Pedido) {
    return pedidoSchema.partial().safeParse(pedido);
}