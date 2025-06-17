import { readJSON } from "../utils/utils.js";
import { randomUUID } from 'node:crypto';

const products = readJSON('../data/products.json'); // Assuming products.json is in the same directory

export class ProductModel {
    static async getAll ({clave}) {
        if (clave) {
            return products.filter(product => 
                product.clave.toLowerCase().includes(clave.toLowerCase())
            );
        }
        return products;
    }

    static async getById ({id}) {
        return products.find(p => p.id === id);
    }

    static async create (inputProduct) {
        const newProduct = {
                id: randomUUID(),
                ...inputProduct
            };
        
        products.push(newProduct);
        return newProduct;
    }   

    static async delete ({id}) {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return false; // Product not found
        }
        
        products.splice(productIndex, 1);
        return true;
    }

    static async update ({id, ...inputProduct}) {
        const productIndex = products.findIndex(p => p.id === id);
        if (productIndex === -1) {
            return false; // Product not found
        }
        
        products[productIndex] = {
            ...products[productIndex],
            ...inputProduct
        };
        return products[productIndex];
    }

}