import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { createProductRouter } from './src/routes/product.js';
import { createSizeProductRouter } from './src/routes/sizeProduct.js';
import { createPedidoRouter } from './src/routes/pedido.js';
import { createUserRouter } from './src/routes/user.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

export function createApp({productModel, sizeProductModel, pedidoModel, userModel}) {
  const app = express();
  app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security
  const port = process.env.PORT ?? 3000;

  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(corsMiddleware()); // Use custom CORS middleware

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  //user
  app.use('/user', createUserRouter({userModel}));

  // roter for product
  app.use('/api/products', createProductRouter({productModel}));

  //router for sizes
  app.use('/api/sizes', createSizeProductRouter({ sizeProductModel }));

  //router fro pedidos
  app.use('/api/pedidos', createPedidoRouter({pedidoModel}))

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return app;
}

