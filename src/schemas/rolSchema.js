import { object, string } from "zod";

export const rolSchema = object({
    clave: string()
        .min(3, 'Min character length is 3')
        .max(15, 'Max character length is 15'),
    descripcion: string()
        .min(5, 'Min character length is 5')
        .max(50, 'Max character length is 50'),
});


export function validateRol(rol) {
    return rolSchema.safeParse(rol);
}

export function validatePartialRol(rol) {
    return rolSchema.partial().safeParse(rol);
}