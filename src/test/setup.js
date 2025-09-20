import { createApp } from "../../app.js";
import { ProductModel } from "../models/firebase/Product.js";
import { SizeProductModel } from "../models/firebase/SizeProduct.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { cert, initializeApp as initializeAppAdmin } from "firebase-admin/app";
import { getAuth as getAuthAdmin } from "firebase-admin/auth";
import { config } from "dotenv";
import { PedidoModel } from "../models/firebase/Pedido.js";
import { UserModel } from '../models/firebase/User.js';
import { AuthenticationMidlleware } from "../middlewares/authentication.js";
import { RolModel } from "../models/firebase/Rol.js";

// Cargar variables de entorno para testing
config({ path: '.env.development' });

// Verificar que las variables de entorno estén cargadas
if (!process.env.PROJECT_ID) {
  console.error('❌ Variables de entorno no encontradas. Asegúrate de tener un archivo .env.development');
  process.exit(1);
}

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
  private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN
};

console.log('🔧 Inicializando Firebase para testing...');
console.log(process.env.PROJECT_ID);
// Inicializar Firebase
const firebaseAdmin = initializeAppAdmin({
  credential: cert(firebaseAdminConfig),
  databaseURL: process.env.DATABASE_URL,
}, "Admin");

const firebase = initializeApp(firebaseConfig, "client");
const firestoreDb = getFirestore(firebase);
const auth = getAuth(firebase);
const authAdmin = getAuthAdmin(firebaseAdmin);

// Crear instancias de modelos
const productModel = new ProductModel({ firestoreDb });
const sizeProductModel = new SizeProductModel({ firestoreDb });
const pedidoModel = new PedidoModel({ firestoreDb });
const userModel = new UserModel({ auth, firestoreDb, authAdmin });
const rolModel = new RolModel({ firestoreDb });
const authenticationModel = new AuthenticationMidlleware(authAdmin);

// Crear la app sin iniciar el servidor
const app = createApp({ 
  authenticationModel, 
  productModel, 
  sizeProductModel, 
  pedidoModel, 
  userModel, 
  rolModel 
}, false); // false = no iniciar el servidor

console.log('✅ Setup de testing completado');

// Exportar la app para usar en los tests
export default app;
