import { createApp } from "./app.js";
import { ProductModel } from "./src/models/firebase/Product.js";
import { initializeApp } from "firebase/app";
import { cert, initializeApp as initializeAppAdmin } from "firebase-admin/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAuth as getAuthAdmin } from "firebase-admin/auth";
import { config } from "dotenv";
import { PedidoModel } from "./src/models/firebase/Pedido.js";
import {UserModel} from './src/models/firebase/User.js'
import { AuthenticationMidlleware } from "./src/middlewares/authentication.js";
import { RolModel } from "./src/models/firebase/Rol.js";
import { CompanyModel } from "./src/models/firebase/Company.js";
import { CatalogModel } from "./src/models/firebase/Catalog.js";
// Definir cuál archivo usar según NODE_ENV
// Cargar archivo .env según el entorno
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
config({ path: envFile });

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const firebaseAdminConfig = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};
// Log the configuration for debugging
const firebaseAdmin = initializeAppAdmin({
  credential: cert(firebaseAdminConfig),
  databaseURL: process.env.DATABASE_URL,
}, "Admin");
const firebase = initializeApp(firebaseConfig, "client");
const firestoreDb = getFirestore(firebase);
const auth = getAuth(firebase);
const authAdmin = getAuthAdmin(firebaseAdmin);

const productModel = new ProductModel({firestoreDb});
const pedidoModel = new PedidoModel({firestoreDb});
const userModel = new UserModel({auth, firestoreDb, authAdmin});
const rolModel = new RolModel({firestoreDb});
const authenticationModel = new AuthenticationMidlleware(authAdmin);
const companyModel = new CompanyModel({firestoreDb});
const catalogModel = new CatalogModel({firestoreDb});

 const app = createApp({
  authenticationModel ,
  productModel, 
  pedidoModel, 
  catalogModel,
  userModel, 
  rolModel,
  companyModel
}, true);

 export default app;
