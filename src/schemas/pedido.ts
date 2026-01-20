import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

/* ---------------------------------------------
   Firestore Timestamp
---------------------------------------------- */
export const firestoreTimestampSchema = z
  .union([
    z.object({
      type: z.literal('firestore/timestamp/1.0'),
      seconds: z.number(),
      nanoseconds: z.number(),
    }),
    z.object({
      seconds: z.number(),
      nanoseconds: z.number(),
    }),
    z.instanceof(Timestamp),
  ])
  .transform((value) => {
    if (value instanceof Timestamp) return value;
    return new Timestamp(value.seconds, value.nanoseconds);
  });

/* ---------------------------------------------
   ProductoPedido
---------------------------------------------- */
export const productoPedidoSchema = z.object({
  id: z.string().min(1),

  cantidad: z.number().int().positive(),

  size: z.object({
    size: z.string(),
    price: z.number().positive(),
  }),

  producto: z.object({
    id: z.string().min(1),
    name: z.string(),
    imagen: z.string().nullable().optional(),
  }),

  caracteristicas: z.string().optional(),
  subtotal: z.number().positive(),
});

/* ---------------------------------------------
   Pedido CREATE (POST)
---------------------------------------------- */
export const pedidoCreateSchema = z.object({
  fechaEntrega: firestoreTimestampSchema,
  lugarEntrega: z.string().optional(),
  cliente: z.string().min(5),

  productos: z.array(productoPedidoSchema).min(1),

  estatus: z.enum(['TODO', 'DONE', 'CANCELED','DELETE']),
  estatusPago: z.enum(['PENDIENTE', 'PAGADO', 'ABONADO']),

  total: z.number().positive(),
  detalles: z.string().optional(),
});

/* ---------------------------------------------
   Pedido UPDATE (PATCH)
---------------------------------------------- */
export const pedidoUpdateSchema = pedidoCreateSchema.partial().extend({
  productos: z.array(productoPedidoSchema).optional(),
});

/* ---------------------------------------------
   Pedido DB (Firestore)
---------------------------------------------- */
export const pedidoDbSchema = pedidoCreateSchema.extend({
  id: z.string().min(1),

  fechaCreacion: firestoreTimestampSchema,
  fechaActualizacion: firestoreTimestampSchema,

  registradoPor: z.string(),
  actualizadoPor: z.string(),
});

/* ---------------------------------------------
   Types
---------------------------------------------- */
export type PedidoCreateInput = z.infer<typeof pedidoCreateSchema>;
export type PedidoUpdateInput = z.infer<typeof pedidoUpdateSchema>;
export type PedidoDB = z.infer<typeof pedidoDbSchema>;
export type ProductoPedido = z.infer<typeof productoPedidoSchema>;

/* ---------------------------------------------
   Validators
---------------------------------------------- */
export const validatePedidoCreate = (data: unknown) =>
  pedidoCreateSchema.safeParse(data);

export const validatePedidoUpdate = (data: unknown) =>
  pedidoUpdateSchema.safeParse(data);



export type EstatusPedido = 'DONE' | 'TODO' | 'CANCELED' | 'DELETE';
export type EstatusPago = 'PENDIENTE' | 'PAGADO' | 'ABONADO';
