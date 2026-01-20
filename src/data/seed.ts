import { Timestamp } from "firebase/firestore";
import { PedidoCreateInput } from "../schemas/pedido.js";
import { ProductoDB } from "../schemas/product.js";
import { Category } from "../schemas/category.js";

export const seedCategories:Category[] = [
  {id:'pizza',descripcion:'pizza'},
  {id:'pastel',descripcion:'pastel'},
  {id:'rosca_reyes',descripcion:'rosca_reyes'},
  {id:'frappe',descripcion:'frappe'},
  {id:'vela',descripcion:'vela'},
  {id:'pan',descripcion:'pan'}
]

export const seedProducts:Partial<ProductoDB>[] = [
  {
    name: 'Pizza',
    descripcion: "Pizza",
    estatus: true,
    category: 'pizza',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}],
  },
  {
    name:'Pastel tres leches',
    descripcion: "Pastel",
    estatus: true,
    category: 'pastel',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}]
  },
  {
    name:'Rosca de Reyes',
    descripcion: "Rosca de Reyes",
    estatus: true,
    category: 'rosca',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}]
  },
]

export const seedPedido:Partial<PedidoCreateInput>[] = [
  {
    fechaEntrega: Timestamp.fromDate(new Date()),
    lugarEntrega: 'Tacahua',
    cliente: "Reyes Bustamante",
    productos: [
      {
        id: "productoPedido1",
        cantidad: 2,
        size: {
          size:'Chica', price:100
        },
        producto: {
          name:'Pizza',
          id: "producto1",
          imagen: null,
        },
        caracteristicas: 'Con mucho queso',
        subtotal: 200
      }
    ],
    estatus: "TODO",
    estatusPago: "PENDIENTE",
    total: 200
  },
  {
    fechaEntrega: Timestamp.fromDate(new Date()),
    lugarEntrega: 'Cerro Prieto',
    cliente: "David Hernandez",
    productos: [
      {
        id: "productoPedido1",
        cantidad: 1,
        size: {size:"Grande",price:250},
        producto: {
          id: "producto2",
          name:'Pastel',
          imagen: null,
        },
        caracteristicas: 'Relleno de fresas',
        subtotal: 250
      }
    ],
    estatus: "TODO",
    estatusPago: "PENDIENTE",
    total: 500
  }
]