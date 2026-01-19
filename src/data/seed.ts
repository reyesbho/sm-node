import { Timestamp } from "firebase/firestore";
import { Pedido } from "../schemas/pedido.js";
import { Producto } from "../schemas/product.js";
import { Category } from "../schemas/category.js";

export const seedCategories:Category[] = [
  {id:'pizza',descripcion:'pizza'},
  {id:'pastel',descripcion:'pastel'},
  {id:'rosca_reyes',descripcion:'rosca_reyes'},
  {id:'frappe',descripcion:'frappe'},
  {id:'vela',descripcion:'vela'},
  {id:'pan',descripcion:'pan'}
]

export const seedProducts:Partial<Producto>[] = [
  {
    name: 'Pizza',
    descripcion: "Pizza",
    imagen: null,
    estatus: true,
    category: 'pizza',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}],
  },
  {
    name:'Pastel tres leches',
    descripcion: "Pastel",
    imagen: null,
    estatus: true,
    category: 'pastel',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}]
  },
  {
    name:'Rosca de Reyes',
    descripcion: "Rosca de Reyes",
    imagen: null,
    estatus: true,
    category: 'rosca',
    sizes:[{size:"Chica", price:100},{size:"Mediana", price:150},{size:"Grande", price:200},{size:"Familiar", price:250}]
  },
]

export const seedPedido:Partial<Pedido>[] = [
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
          descripcion: "Pizza",
          imagen: null,
          estatus: true,
          category: 'pizza',
          sizes: []
        },
        caracteristicas: 'Con mucho queso',
        subtotal: 200
      }
    ],
    estatus: "TODO",
    registradoPor: "test@gmail.com",
    fechaCreacion: Timestamp.fromDate(new Date()),
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
          descripcion: "Pastel",
          imagen: null,
          estatus: true,
          category: 'pastel',
          sizes: []
        },
        caracteristicas: 'Relleno de fresas',
        subtotal: 250
      }
    ],
    estatus: "TODO",
    registradoPor: "test@gmail.com",
    fechaCreacion: Timestamp.fromDate(new Date()),
    estatusPago: "PENDIENTE",
    total: 500
  }
]