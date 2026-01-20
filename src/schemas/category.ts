import { z } from 'zod';

/* ---------------------------------------------
   Category CREATE
---------------------------------------------- */
export const categoryCreateSchema = z.object({
  descripcion: z.string().max(200, 'Máximo 200 caracteres'),
});

/* ---------------------------------------------
   Category UPDATE
---------------------------------------------- */
export const categoryUpdateSchema = categoryCreateSchema.partial();

/* ---------------------------------------------
   Category DB
---------------------------------------------- */
export const categoryDbSchema = categoryCreateSchema.extend({
  id: z.string().min(1),
});

/* ---------------------------------------------
   Types
---------------------------------------------- */
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type Category = z.infer<typeof categoryDbSchema>;

/* ---------------------------------------------
   Validators
---------------------------------------------- */
export const validateCategoryCreate = (data: unknown) =>
  categoryCreateSchema.safeParse(data);

export const validateCategoryUpdate = (data: unknown) =>
  categoryUpdateSchema.safeParse(data);
