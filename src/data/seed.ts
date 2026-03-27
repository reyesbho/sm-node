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
  {id:'hotcakes',descripcion:'hotcakes'},
  {id:'pan',descripcion:'pan'},
  {id:'cafe',descripcion:'cafe'},
  {id:'ramo',descripcion:'ramo'}
]

const defaultSizes = [{ size: 'Por defecto' as const, price: 0 }];

export const seedProducts:Partial<ProductoDB>[] = [
  {
    name: "Vela numérica",
    descripcion: "Vela numérica",
    estatus: true,
    category: "vela",
    sizes: defaultSizes,
  },
  {
    name: "Pizza",
    descripcion: "Pizza",
    estatus: true,
    category: "pizza",
    sizes: defaultSizes,
    imagen: "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/pizza.webp",
  },
  {
    name: "Gelatina",
    descripcion: "Gelatina",
    estatus: true,
    category: "gelatina",
    sizes: defaultSizes,
    imagen: "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/gelatina.webp",
  },
  {
    name: "Chocoflan",
    descripcion: "Chocoflan",
    estatus: true,
    category: "chocoflan",
    sizes: defaultSizes,
  },
  {
    name: "Mini hotcakes",
    descripcion: "Mini hotcakes",
    estatus: true,
    category: "hotcakes",
    sizes: defaultSizes,
  },
  {
    name: "Pastel",
    descripcion: "Pastel",
    estatus: true,
    category: "pastel",
    sizes: defaultSizes,
    imagen: "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/pastel.webp",
  },
  {
    name: "Cafe",
    descripcion: "Cafe",
    estatus: true,
    category: "cafe",
    sizes: defaultSizes,
  },
  {
    name: "Frappe",
    descripcion: "Frappe",
    estatus: true,
    category: "frappe",
    sizes: defaultSizes,
    imagen: "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/frape.webp",
  },
  {
    name: "Vela pirotecnica",
    descripcion: "Vela pirotecnica",
    estatus: true,
    category: "vela",
    sizes: defaultSizes,
  },
  {
    name: "Coop Cake",
    descripcion: "Coop Cake",
    estatus: true,
    category: "pastel",
    sizes: defaultSizes,
    imagen: "https://s3-sm-static-content.s3.us-east-2.amazonaws.com/images/cupcake.webp",
  },
  {
    name: "Ramo",
    descripcion: "Ramo",
    estatus: true,
    category: "ramo",
    sizes: defaultSizes,
  },
]

export const seedPedido = []