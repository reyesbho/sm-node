import express, { json } from 'express';
import { producsRouter } from './routes/product.js';
import { corsMiddleware } from './middlewares/cors.js';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

const app = express();

app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security
const port = process.env.PORT ?? 3000;

app.use(json()); // Middleware to parse JSON bodies

app.use(corsMiddleware()); // Use custom CORS middleware

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Import and use the product router
app.use('/api/products', producsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;
