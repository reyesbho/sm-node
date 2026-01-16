import { Timestamp } from "firebase/firestore";
import { Pedido } from "../schemas/pedido.js";
import { Producto } from "../schemas/product.js";

export const seedProducts:Partial<Producto>[] = [
  {
    descripcion: "Pizza",
    imagen: null,
    estatus: true,
    category: null,
    sizes:["Chica","Mediana","Grande","Familiar"],
  },
  {
    descripcion: "Pastel",
    imagen: null,
    estatus: true,
    category: null,
    sizes:["Chica","Mediana","Grande","Familiar",'Mini']
  },
  {
    descripcion: "Rosca de Reyes",
    imagen: null,
    estatus: true,
    category: null,
    sizes:["Chica","Mediana","Grande","Familiar",'Mini']
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
        cantidad: 1,
        size: "Chica",
        producto: {
          id: "producto1",
          descripcion: "Pizza",
          imagen: null,
          estatus: true,
          category: null,
          sizes: []
        },
        caracteristicas: ['Con mucho queso'],
        precio: 200
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
        size: "Grande",
        producto: {
          id: "producto2",
          descripcion: "Pastel",
          imagen: null,
          estatus: true,
          category: null,
          sizes: []
        },
        caracteristicas: ['Relleno de fresas'],
        precio: 500
      }
    ],
    estatus: "TODO",
    registradoPor: "test@gmail.com",
    fechaCreacion: Timestamp.fromDate(new Date()),
    estatusPago: "PENDIENTE",
    total: 500
  }
]