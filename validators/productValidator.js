
const z = require('zod');

const productSchema = z.object({
        clave: z.string().min(5, 'Min caracter length is 5'),
        descripcion: z.string().min(5, 'Min caracter length is 5'),
        imagen: z.string().optional(),
        estatus: z.boolean().default(true),
        isCompleted: z.boolean().default(false)
    });


function validateProduct(product) {
    return productSchema.safeParse(product);
}

function validatePartialProduct(product) {
    return productSchema.partial().safeParse(product);
}   

module.exports = {
    validateProduct,
    validatePartialProduct
};