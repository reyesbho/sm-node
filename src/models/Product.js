import { readJSON } from "../utils/utils.js";
import { randomUUID } from 'node:crypto';

let products = readJSON('../data/products.json'); // Assuming products.json is in the same directory

export class ProductModel {
    static async getAll ({tag}) {
        if (tag) {
            return products.filter(product => 
                product.tag.toLowerCase() === tag.toLowerCase()
            );
        }
        return products;
    }

    static async getById ({id}) {
        const product = products.find(p => p.id == id);
        return product;
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
        const productIndex = products.findIndex(p => p.id == id);
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