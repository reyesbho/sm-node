import { object, string } from "zod";

export const loginSchema = object({
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

export function validateLogin(user){
    return loginSchema.safeParse(user);
}

export function validatePartialLogin(user){
    return loginSchema.partial().safeParse(user);
}