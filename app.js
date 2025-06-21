import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { createProductRouter } from './src/routes/product.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

export function createApp({productModel}) {
  const app = express();
  app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security
  const port = process.env.PORT ?? 3000;

  app.use(express.json()); // Middleware to parse JSON bodies
  app.use(corsMiddleware()); // Use custom CORS middleware

  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // Import and use the product router
  app.use('/api/products', createProductRouter({productModel}));

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  return app;
}

