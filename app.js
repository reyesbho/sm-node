import express, { json } from 'express';
import { randomUUID } from 'node:crypto';
import { validateProduct, validatePartialProduct } from './validators/productValidator.js';
const ACCEPTED_ORIGIN = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://sweetmomets:8080',
    'https://sweetmomets.com'
]; // Replace with your actual origin
import cors from 'cors';
import fs from 'node:fs';

// Load products from a JSON file
//let products = JSON.parse(fs.readFileSync('./products.json', 'utf-8') || '[]');

//crate your own required products
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const products = require('./products.json'); // Assuming products.json is in the same directory

const app = express();
app.use(json()); // Middleware to parse JSON bodies
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ACCEPTED_ORIGIN.includes(origin)) {
            return callback(null, true);
        } 
        return callback(new Error('CORS policy violation: Origin not allowed'));
    }
})); 

app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security
const port = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/products', (req, res) => {
    const {search} = req.query;
    if (search) {
        const filteredProducts = products.filter( product =>
            product.clave.toLowerCase().includes(search.toLowerCase())
        );
        return res.json(filteredProducts);
    }

    res.json(products);
});   

app.get('/api/products/:id', (req, res) => {
    const {id} = req.params;  
    const product = products.find(p => p.id === parseInt(id));
  
    if (!product) {
        return res.status(422).send('Product not found');
    }
  
    res.json(product);
});

app.post('/api/products', (req, res) => {
   const result = validateProduct(req.body);
   if (result.error) {
        return res.status(400).json({error:JSON.parse(result.error.message)});
    }

    const newProduct = {
        id: randomUUID(),
        ...result.data
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
    const {id} = req.params;
    const result = validatePartialProduct(req.body);
    if (result.error) {
        return res.status(400).json({error:JSON.parse(result.error.message)});
    }

    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }

    const updatedProduct = {
        ...products[productIndex],
        ...result.data
    };

    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
    const {id} = req.params;
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex === -1) {
        return res.status(404).send('Product not found');
    }

    products.splice(productIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});