import { createApp } from "./app.js";
import { ProductModel } from "./models/firebase/Product.js";

 const app = createApp({productModel: ProductModel});

 export default app;
