//crate your own required products
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (filePath) => require(filePath);

export const estatusPedido = Object.freeze({
    BACKLOG:'INCOMPLETO',
    DONE:'PAGADO',
    CANCELED:'CANCELED',
    INCOMPLETE:'INCOMPLETE',
    DELETE: 'DELETE'
})

export const estatusPago = Object.freeze({
    PENDIENTE:'PENDIENTE',
    PAGADO:'PAGADO'
})