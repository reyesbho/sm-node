import { object, string, z } from "zod";

export const loginSchema = object({
    idToken: string()
});

export interface Login{
    idToken: string
}

export function validateLogin(login:Login) {
    return loginSchema.safeParse(login);
}
