
import { object, string, boolean, number} from 'zod';

const categorySchema = object({
        descripcion: string().max(200, 'Maximo 200 caracteres')
    });


export interface Category{
    id: string,
    descripcion: string
}

export  function validateCategory(product: Category) {
    return categorySchema.safeParse(product);
}

export function validatePartialProduct(product: Category) {
    return categorySchema.partial().safeParse(product);
}   
