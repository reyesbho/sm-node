import { Timestamp } from "firebase/firestore";
import { PedidoCreateInput } from "../schemas/pedido.js";
import { ProductoDB } from "../schemas/product.js";
import { Category } from "../schemas/category.js";

export const seedCategories:Category[] = [
  {id:'pizza',descripcion:'pizza'},
  {id:'pastel',descripcion:'pastel'},
  {id:'gelatina',descripcion:'gelatina'},
  {id:'chocoflan',descripcion:'chocoflan'},
  {id:'rosca_reyes',descripcion:'rosca_reyes'},
  {id:'frappe',descripcion:'frappe'},
  {id:'vela',descripcion:'vela'},
  {id:'hotcakes',descripcion:'vela'},
  {id:'pan',descripcion:'pan'},
  {id:'cafe',descripcion:'cafe'},
  {id:'ramo',descripcion:'ramo'}
]

export const seedProducts:Partial<ProductoDB>[] = [
  {
        "id": "45HHtvWzsxoAaDu1mP9K",
        "estatus": true,
        "category": "vela",
        "descripcion": "Vela numérica"
    },
    {
        "id": "8ZCklRYVVOAz8TX969rY",
        "category": "pizza",
        "descripcion": "Pizza",
        "estatus": true,
        "imagen": "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/pizza.webp"
    },
    {
        "id": "F7WZJTouBOFFDcKWtq1M",
        "descripcion": "Gelatina",
        "category": "gelatina",
        "estatus": true,
        "imagen": "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/gelatina.webp"
    },
    {
        "id": "GpjJ5Mr3XyMGOE4QkPhL",
        "descripcion": "Chocoflan",
        "category": "chocoflan",
        "estatus": true
    },
    {
        "id": "HmySiO9SVBufMo5g8Gbs",
        "category": "hotcakes",
        "descripcion": "Mini hotcakes",
        "estatus": true
    },
    {
        "id": "R8IY666JVUuJQLqJr8dM",
        "descripcion": "Pastel",
        "category": "pastel",
        "estatus": true,
        "imagen": "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/pastel.webp"
    },
    {
        "id": "TPQaDs1VQbFTOoJFyx8h",
        "estatus": true,
        "category": "cafe",
        "descripcion": "Cafe"
    },
    {
        "id": "n5bKhHi0rFpnizMTFfN6",
        "descripcion": "Frappe",
        "category": "frappe",
        "estatus": true,
        "imagen": "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/frape.webp"
    },
    {
        "id": "wZjCqTcMbYbSsaQawBvV",
        "descripcion": "Vela pirotecnica",
        "category": "v_pirotecnica",
        "estatus": true,
        "imagen": "data:image/webp;base64,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"
    },
    {
        "id": "xrjEfXD50KYINpOAsBDg",
        "category": "coopcake",
        "descripcion": "Coop Cake",
        "estatus": true,
        "imagen": "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/cupcake.webp"
    },
    {
        "id": "zSBb1JBN2jyuSsujNuuQ",
        "estatus": true,
        "descripcion": "Ramo",
        "category": "ramo"
    }
]

export const seedPedido:Partial<PedidoCreateInput>[] = [
]