
import { object, string, boolean } from 'zod';

const productSchema = object({
        descripcion: string().min(3, 'Min caracter length is 3'),
        imagen: string().optional(),
        estatus: boolean().default(true),
        tag: string()
            .max(20, 'Max character length is 20')
            .regex(/^[a-z_]+$/, 'Only lowercase letters without spaces or numbers allowed')
            .optional()
    });


export  function validateProduct(product) {
    return productSchema.safeParse(product);
}

export function validatePartialProduct(product) {
    return productSchema.partial().safeParse(product);
}   
