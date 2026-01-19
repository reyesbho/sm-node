
import { object, string, boolean, number} from 'zod';

const productSchema = object({
        name: string().min(3, 'Min caracter length is 3'),
        descripcion: string().max(200, 'Maximo 200 caracteres'),
        imagen: string().optional(),
        estatus: boolean().default(true),
        sizes:object({
            size: string().max(20),
            price: number().positive().default(0),
        }).array().min(1),
        category: string()
            .max(20, 'Max character length is 20')
            .regex(/^[a-z_]+$/, 'Only lowercase letters without spaces or numbers allowed')
            .optional()
    });


export type SizeTag = 'Chica' | 'Mediana' | 'Grande' | 'Familiar' | 'Mini' | 'Default'
export interface Size{
    size: SizeTag,
    price: number
}

export interface Producto{
    id: string,
    name: string,
    descripcion: string,
    imagen: string | null,
    estatus: boolean,
    category: string | null,
    sizes:Size[]
}

export  function validateProduct(product: Producto) {
    return productSchema.safeParse(product);
}

export function validatePartialProduct(product: Producto) {
    return productSchema.partial().safeParse(product);
}   
