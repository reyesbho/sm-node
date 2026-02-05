import { createApp } from "./app.js";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { config } from "dotenv";
import { UserModel } from './models/firebase/User.js'
import { ProductModel } from "./models/firebase/Product.js";
import { PedidoModel } from "./models/firebase/Pedido.js";
import { AuthenticationMidlleware } from "./middlewares/authentication.js";
import { cert, initializeApp as initializeAppAdmin } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { CategoryModel } from "./models/firebase/Category.js";
import { S3Client } from '@aws-sdk/client-s3';
import { FileImagesModel } from "./models/aws/FileImages.js";
// Definir cuál archivo usar según NODE_ENV
// Cargar archivo .env según el entorno
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
config({ path: envFile });

//config for s3 client AWS
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

const firebaseAdmin = initializeAppAdmin({
  credential: cert({
    projectId: process.env.PROJECT_ID,
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Log the configuration for debugging
const firebase = initializeApp(firebaseConfig);
const firestoreDb = getFirestore(firebase);
export const authAdmin = getAuth(firebaseAdmin);

const productModel = new ProductModel({ firestoreDb });
const pedidoModel = new PedidoModel({ firestoreDb });
const userModel = new UserModel({ firestoreDb});
const categoryModel = new CategoryModel({firestoreDb});
const authenticationModel = new AuthenticationMidlleware();
const fileImagesModel = new FileImagesModel();

const app = createApp({ authenticationModel, productModel, pedidoModel, userModel, categoryModel, fileImagesModel, s3 });

export default app;
