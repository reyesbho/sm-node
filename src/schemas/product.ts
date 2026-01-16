
import { object, string, boolean} from 'zod';
import {z} from 'zod';

const productSchema = object({
        descripcion: string().min(3, 'Min caracter length is 3'),
        imagen: string().optional(),
        estatus: boolean().default(true),
        category: string()
            .max(20, 'Max character length is 20')
            .regex(/^[a-z_]+$/, 'Only lowercase letters without spaces or numbers allowed')
            .optional()
    });


export type SizeTag = 'Chica' | 'Mediana' | 'Grande' | 'Familiar' | 'Mini' | 'Default'
export interface Producto{
    id: string,
    descripcion: string,
    imagen: string | null,
    estatus: boolean,
    category: string | null,
    sizes:SizeTag[]
}

export  function validateProduct(product: Producto) {
    return productSchema.safeParse(product);
}

export function validatePartialProduct(product: Producto) {
    return productSchema.partial().safeParse(product);
}   
