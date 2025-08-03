import { createApp } from "./app.js";
import { ProductModel } from "./src/models/firebase/Product.js";
import { SizeProductModel } from "./src/models/firebase/SizeProduct.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { config } from "dotenv";
import { PedidoModel } from "./src/models/firebase/Pedido.js";
import {UserModel} from './src/models/firebase/User.js'
import { AuthenticationMidlleware } from "./src/middlewares/authentication.js";
config(); // Load environment variables from .env file
const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};
// Log the configuration for debugging
const firebase = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebase);
const auth = getAuth(firebase);

const productModel = new ProductModel({firestoreDb});
const sizeProductModel = new SizeProductModel({firestoreDb});
const pedidoModel = new PedidoModel({firestoreDb});
const userModel = new UserModel({auth});
const authenticationModel = new AuthenticationMidlleware();

 const {app, server} = createApp({authenticationModel ,productModel, sizeProductModel, pedidoModel, userModel});

 export {app, server};
