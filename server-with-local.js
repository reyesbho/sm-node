import { createApp } from "./app.js";
import { ProductModel } from "./src/models/Product.js";

 const app = createApp({productModel: ProductModel});

 export default app;
