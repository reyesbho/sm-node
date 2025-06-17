
import { object, string, boolean } from 'zod';

const productSchema = object({
        clave: string().min(5, 'Min caracter length is 5'),
        descripcion: string().min(5, 'Min caracter length is 5'),
        imagen: string().optional(),
        estatus: boolean().default(true),
        isCompleted: boolean().default(false)
    });


export  function validateProduct(product) {
    return productSchema.safeParse(product);
}

export function validatePartialProduct(product) {
    return productSchema.partial().safeParse(product);
}   
