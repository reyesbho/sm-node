import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { createProductRouter } from './src/routes/productRouter.js';
import { createSizeProductRouter } from './src/routes/sizeProductRouter.js';
import { createPedidoRouter } from './src/routes/pedidoRouter.js';
import { createUserRouter } from './src/routes/userRouter.js';
import cookieParser from 'cookie-parser';
import { createPedidoPublicRouter } from './src/routes/pedidoPublicRouter.js';
import { createRolRouter } from './src/routes/rolRouter.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

export function createApp({authenticationModel, productModel, sizeProductModel, pedidoModel, userModel, rolModel}, startServer = true) {
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

  // roter for product
  app.use('/api/products',authenticationModel.authenticate, createProductRouter({productModel}));

  //router for sizes
  app.use('/api/sizes', authenticationModel.authenticate, createSizeProductRouter({ sizeProductModel }));

  //router fro pedidos
  app.use('/api/pedidos', authenticationModel.authenticate, createPedidoRouter({pedidoModel}))

  //router for roles
  app.use('/api/roles', authenticationModel.authenticate, createRolRouter({rolModel}))

  // Solo iniciar el servidor si startServer es true (por defecto)
  if (startServer) {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }

  return app;
}

