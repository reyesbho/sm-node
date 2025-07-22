import {object, date, number, string, boolean} from 'zod';

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
        size:object({
            id: string().min(1, 'Product ID is required'),
            descripcion : string().min(5, 'Min character length is 5')
        }),
        producto: object({
            id: string().min(1, 'Product ID is required'),
            descripcion: string().min(5, 'Min caracter length is 5'),
            imagen: string().optional()
        }),
        caracteristicas: string().array().optional(),
        precio: number().positive('Price must be a positive number').default(0),
    }).array().optional(),
}).passthrough();


export function validatePedido(pedido) {
    return pedidoSchema.safeParse(pedido);
}

export function validatePartialPedido(pedido) {
    return pedidoSchema.partial().safeParse(pedido);
}