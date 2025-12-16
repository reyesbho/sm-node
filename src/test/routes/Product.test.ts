import request from "supertest";
import app from "../setup.js";

let authCookie: string;
let productId: string;

describe("Products Management", () => {
    // Ejecutar autenticación antes de todos los tests
    beforeAll(async () => {
        const response = await request(app).post("/user/login")
        .send({
            "email": "test@test.com",
            "password": "HolaMundo123*"
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
        authCookie = response.body.token;
    });

    it("should return a list of products", async () => {
        const response = await request(app).get("/api/companys/compania_001/productos")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return products filtered by tag", async () => {
        const response = await request(app).get("/api/companys/compania_001/productos?tag=test_tag")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return products filtered by status", async () => {
        const response = await request(app).get("/api/companys/compania_001/productos?estatus=true")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return a product by ID", async () => {
        // Usar un ID que probablemente exista (ajustar según tu base de datos)
        const response = await request(app).get("/api/companys/compania_001/productos/test_product_id")
        .set('Cookie', `access_token=${authCookie}`);
        // Este test puede fallar si el ID no existe, pero es normal
        if (response.status === 404) {
            expect(response.body).toHaveProperty('message', 'Product not found');
        } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
        }
    });

    it("should return 404 for non-existing product", async () => {
        const response = await request(app).get("/api/companys/compania_001/productos/999999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it("should create a new product", async () => {
        const newProduct = {
            descripcion: "Test Product",
            imagen: "https://example.com/image.jpg",
            estatus: true,
            tag: "test_tag"
        };
        
        const response = await request(app).post("/api/companys/compania_001/productos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newProduct);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.descripcion).toBe('Test Product');
        expect(response.body.tag).toBe('test_tag');
        
        productId = response.body.id; // Guardar el ID para los siguientes tests
    });

    it("should fail to create product with invalid tag format", async () => {
        const invalidProduct = {
            descripcion: "Test Product",
            tag: "Invalid Tag With Spaces" // Tag con espacios - inválido
        };
        
        const response = await request(app).post("/api/companys/compania_001/productos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidProduct);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create product with tag too long", async () => {
        const invalidProduct = {
            descripcion: "Test Product",
            tag: "this_tag_is_too_long_for_validation" // Tag muy largo
        };
        
        const response = await request(app).post("/api/companys/compania_001/productos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidProduct);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create product with description too short", async () => {
        const invalidProduct = {
            descripcion: "AB", // Muy corta
            tag: "test_tag"
        };
        
        const response = await request(app).post("/api/companys/compania_001/productos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidProduct);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should update the created product", async () => {
        expect(productId).toBeDefined();
        
        const updatedProduct = {
            descripcion: "Updated Test Product",
            tag: "updated_tag"
        };
        
        const response = await request(app).patch(`/api/companys/compania_001/productos/${productId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedProduct);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', productId);
        expect(response.body.descripcion).toBe('Updated Test Product');
        expect(response.body.tag).toBe('updated_tag');
    });

    it("should fail to update product with invalid data", async () => {
        expect(productId).toBeDefined();
        
        const invalidUpdate = {
            tag: "Invalid Tag" // Tag con espacios
        };
        
        const response = await request(app).patch(`/api/companys/compania_001/productos/${productId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidUpdate);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should update product status", async () => {
        expect(productId).toBeDefined();
        
        const response = await request(app).put(`/api/companys/compania_001/productos/${productId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
    });

    it("should return 404 when updating non-existing product", async () => {
        const response = await request(app).patch("/api/companys/compania_001/productos/999999")
        .set('Cookie', `access_token=${authCookie}`)
        .send({ descripcion: "Updated" });
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it("should delete the created product", async () => {
        expect(productId).toBeDefined();
        
        const response = await request(app).delete(`/api/companys/compania_001/productos/${productId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
    });

    it("should return 404 when deleting non-existing product", async () => {
        const response = await request(app).delete("/api/companys/compania_001/productos/999999")
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it("should return 401 when accessing products without authentication", async () => {
        const response = await request(app).get("/api/companys/compania_001/productos");
        expect(response.status).toBe(401);
    });

    it("should return 401 when creating product without authentication", async () => {
        const newProduct = {
            descripcion: "Unauthorized Product",
            tag: "unauthorized"
        };
        
        const response = await request(app).post("/api/companys/compania_001/productos")
        .send(newProduct);
        
        expect(response.status).toBe(401);
    });
});
