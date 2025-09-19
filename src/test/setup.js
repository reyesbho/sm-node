import { createApp } from "../../app.js";
import { ProductModel } from "../models/firebase/Product.js";
import { SizeProductModel } from "../models/firebase/SizeProduct.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { config } from "dotenv";
import { PedidoModel } from "../models/firebase/Pedido.js";
import { UserModel } from '../models/firebase/User.js';
import { AuthenticationMidlleware } from "../middlewares/authentication.js";
import { RolModel } from "../models/firebase/Rol.js";

// Cargar variables de entorno para testing
config({ path: '.env.development' });

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

// Inicializar Firebase
const firebase = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebase);
const auth = getAuth(firebase);

// Crear instancias de modelos
const productModel = new ProductModel({ firestoreDb });
const sizeProductModel = new SizeProductModel({ firestoreDb });
const pedidoModel = new PedidoModel({ firestoreDb });
const userModel = new UserModel({ auth });
const rolModel = new RolModel({ firestoreDb });
const authenticationModel = new AuthenticationMidlleware();

// Crear la app sin iniciar el servidor
const app = createApp({ 
  authenticationModel, 
  productModel, 
  sizeProductModel, 
  pedidoModel, 
  userModel, 
  rolModel 
}, false); // false = no iniciar el servidor

// Exportar la app para usar en los tests
export default app;
