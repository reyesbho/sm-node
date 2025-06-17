const express = require('express');
let products = require('./products.json'); // Assuming products.json is in the same directory
const crypto = require('node:crypto');
const { validateProduct, validatePartialProduct } = require('./validators/productValidator');
const ACCEPTED_ORIGIN = [
    'http://localhost:8080',
    'http://sweetmomets:8080',
    'https://sweetmomets.com'
]; // Replace with your actual origin
const cors = require('cors');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
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
        id: crypto.randomUUID(),
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});