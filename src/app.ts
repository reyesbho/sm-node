import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middlewares/cors.js';
import { AuthenticationMidlleware } from './middlewares/authentication.js';
import { ProductModel } from './models/firebase/Product.js';
import { PedidoModel } from './models/firebase/Pedido.js';
import { UserModel } from './models/firebase/User.js';
import { createUserRouter } from './routes/user.js';
import { createPedidoPublicRouter } from './routes/pedidoPublic.js';
import { createProductRouter } from './routes/product.js';
import { createPedidoRouter } from './routes/pedido.js';
import { createSeedRouter } from './routes/seed.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');
interface CreateApp {
    authenticationModel:AuthenticationMidlleware, 
    productModel:ProductModel, 
    pedidoModel:PedidoModel, 
    userModel:UserModel
  }
export function createApp({authenticationModel, productModel, pedidoModel, userModel}:CreateApp) {
  const app = express();
  app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security
  const port = process.env.PORT ?? 3000;

  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(corsMiddleware()); // Use custom CORS middleware
  app.use(cookieParser());
  app.use(express.json({ limit: '6mb' })); // Increase JSON body size limit

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  //user
  app.use('/user', createUserRouter({userModel}));

  // Public routes for pedidos
  app.use('/api/public/pedidos', createPedidoPublicRouter({pedidoModel}));

  // Public seed
  app.use('/api/seed', createSeedRouter(pedidoModel, productModel));

  // roter for product
  app.use('/api/products',authenticationModel.authenticate, createProductRouter({productModel}));

  //router fro pedidos
  app.use('/api/pedidos', authenticationModel.authenticate, createPedidoRouter({pedidoModel}))

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return app;
}

