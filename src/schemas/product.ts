import { z } from 'zod';

/* ---------------------------------------------
   Enums
---------------------------------------------- */
export const sizeTagEnum = z.enum([
  'Chica',
  'Mediana',
  'Grande',
  'Familiar',
  'Mini',
  'Por defecto',
]);

/* ---------------------------------------------
   Size
---------------------------------------------- */
export const sizeSchema = z.object({
  size: sizeTagEnum,
  price: z.number().nonnegative(),
});

/* ---------------------------------------------
   Producto CREATE
---------------------------------------------- */
export const productCreateSchema = z.object({
  name: z.string().min(3, 'Min character length is 3'),

  descripcion: z.string().max(200, 'Max 200 characters'),

  imagen: z.string().nullable().optional(),

  estatus: z.boolean().default(true),

  sizes: z.array(sizeSchema).min(1),

  category: z
    .string()
    .max(20)
    .regex(/^[a-z_]+$/, 'Only lowercase letters and underscores allowed')
    .optional(),
});

/* ---------------------------------------------
   Producto UPDATE
---------------------------------------------- */
export const productUpdateSchema = productCreateSchema.partial();

/* ---------------------------------------------
   Producto DB
---------------------------------------------- */
export const productDbSchema = productCreateSchema.extend({
  id: z.string().min(1),
});

/* ---------------------------------------------
   Types
---------------------------------------------- */
export type SizeTag = z.infer<typeof sizeTagEnum>;
export type Size = z.infer<typeof sizeSchema>;
export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductoDB = z.infer<typeof productDbSchema>;

/* ---------------------------------------------
   Validators
---------------------------------------------- */
export const validateProductCreate = (data: unknown) =>
  productCreateSchema.safeParse(data);

export const validateProductUpdate = (data: unknown) =>
  productUpdateSchema.safeParse(data);

