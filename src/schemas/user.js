import { object, string } from "zod";

export const userSchema = object({
    email: string()
        .email("El usuario debe ser un correo electrónico válido")
        .regex(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "El correo electrónico no tiene un formato válido"
        ),
    password: string()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
            "La contraseña debe contener mayúsculas, minúsculas, números y un carácter especial"
        )
});

export function validateUser(user){
    return userSchema.safeParse(user);
}

export function validatePartialUser(user){
    return userSchema.partial().safeParse(user);
}