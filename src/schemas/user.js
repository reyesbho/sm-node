import { object, string } from "zod";

export const userSchema = object({
    fullName: string().max(50),
    email: string()
        .email("El usuario debe ser un correo electrónico válido")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "El correo electrónico no tiene un formato válido"
        )
});

export function validateUser(user) {
    return userSchema.safeParse(user);
}

export function validatePartialUser(user) {
    return userSchema.partial().safeParse(user);
}