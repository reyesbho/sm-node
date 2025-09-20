import { number, object } from "zod";

export const estatusPedido = Object.freeze({
    BACKLOG:'BACKLOG',
    DONE:'DONE',
    CANCELED:'CANCELED',
    INCOMPLETE:'INCOMPLETE',
    DELETE: 'DELETE'
})

export const estatusPago = Object.freeze({
    PENDIENTE:'PENDIENTE',
    PAGADO:'PAGADO'
})


export const ErrorCodeFirebase = Object.freeze({
    EXPIRED_TOKEN :'auth/id-token-expired',
    EMAIL_EXIST: 'auth/email-already-in-use'
})

export const timestampSchema = object({
  seconds: number().int().nonnegative(),
  nanoseconds: number().int().min(0).max(999_999_999),
});


export const formateDate = (date) => {
    return Intl.DateTimeFormat('es-ES',{
        day: '2-digit',
        month : '2-digit',
        year : 'numeric'
    }).format(date);
}