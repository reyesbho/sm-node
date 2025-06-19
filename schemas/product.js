
import { object, string, boolean } from 'zod';

const productSchema = object({
        descripcion: string().min(5, 'Min caracter length is 5'),
        imagen: string().optional(),
        estatus: boolean().default(true),
        tag: string()
            .max(10, 'Max character length is 10')
            .regex(/^[a-z]+$/, 'Only lowercase letters without spaces or numbers allowed')
            .optional()
    });


export  function validateProduct(product) {
    return productSchema.safeParse(product);
}

export function validatePartialProduct(product) {
    return productSchema.partial().safeParse(product);
}   
