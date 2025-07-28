import {boolean, object, string} from 'zod';

const sizeProduct = object({
    descripcion : string().min(4, 'Min character length is 4'),
    estatus: boolean().default(true),
    tags: string().array().optional()
});

export function validateSizeProduct(size) {
    return sizeProduct.safeParse(size);
}

export function validatePartialSizeProduct(size) {
    return sizeProduct.partial().safeParse(size);
}