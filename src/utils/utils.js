
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