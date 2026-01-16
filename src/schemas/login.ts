import { object, string, z } from "zod";

export const loginSchema = object({
    idToken: string(),
    refreshToken: string()
});

export interface Login{
    idToken: string,
    refreshToken: string,
}

export function validateLogin(login:Login) {
    return loginSchema.safeParse(login);
}
