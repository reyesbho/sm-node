import {object, date, number, string, boolean} from 'zod';

export const pedidoSchema = object({
    fechaEntrega: date(),
    lugarEntrega: string().optional(),
    cliente: string().min(5, 'Min character length is 5'),
    productos: object({
        id: string().min(1, 'Product ID is required'),
        cantidad: number().int().positive('Quantity must be a positive integer'),
        size:object({
            descripcion : string().min(20, 'Min character length is 5'),
            estatus: boolean().default(true),
        }),
        producto: object({
            descripcion: string().min(5, 'Min caracter length is 5'),
            imagen: string().optional()
        }),
        caracteristicas: string().array().optional(),
        precio: number().positive('Price must be a positive number').default(0),
    }).array(),
});


export function validatePedido(pedido) {
    return pedidoSchema.safeParse(pedido);
}

export function validatePartialPedido(pedido) {
    return pedidoSchema.partial().safeParse(pedido);
}