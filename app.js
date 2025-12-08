import express from 'express';
import { corsMiddleware } from './src/middlewares/cors.js';
import { createProductRouter } from './src/routes/productRouter.js';
import { createSizeProductRouter } from './src/routes/sizeProductRouter.js';
import { createPedidoRouter } from './src/routes/pedidoRouter.js';
import { createUserRouter } from './src/routes/userRouter.js';
import cookieParser from 'cookie-parser';
import { createPedidoPublicRouter } from './src/routes/pedidoPublicRouter.js';
import { createRolRouter } from './src/routes/rolRouter.js';
import { createUserPrivateRouter } from './src/routes/userPrivateRouter.js';
import { createCompanyRouter } from './src/routes/CompanyRouter.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

export function createApp({authenticationModel, productModel, sizeProductModel, pedidoModel, userModel, rolModel, companyModel}, startServer = true) {
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
  app.use('/user', createUserRouter({userModel, rolModel}));
  //user
  app.use('/user',authenticationModel.authenticate, createUserPrivateRouter({userModel}));

  // Public routes for pedidos
  app.use('/api/public/pedidos', createPedidoPublicRouter({pedidoModel}));

  //router for roles
  app.use('/api/roles', authenticationModel.authenticate, createRolRouter({rolModel}))

  //router for company
  app.use('/api/companys', authenticationModel.authenticate, createCompanyRouter({companyModel, productModel, sizeProductModel, pedidoModel}));

  // Solo iniciar el servidor si startServer es true (por defecto)
  if (startServer) {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  }

  return app;
}

