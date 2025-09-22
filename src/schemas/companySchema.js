import { object, string } from "zod";

export const companySchema = object({
    razonSocial: string()
                    .min(5,"Min character length is 5")
                    .max(30, "Max character length us 30"),
    imgLogo: string().optional(),
    descripcion: string().
                    max(100, "Max character length is 100")
                    .optional()
}).passthrough();

export function validateCompany(company){
    return companySchema.safeParse(company);
}

export function validatePartialCompany(company){
    return companySchema.partial().safeParse(company);
}