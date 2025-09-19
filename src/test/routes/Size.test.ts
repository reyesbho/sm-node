
import request from 'supertest';
import app from '../setup.js';

let authCookie: string;
let sizeId: string;
describe("Catalogs sizes", () => {
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

    it("should return a list of sizes", async () => {
        const response = await request(app).get("/api/sizes")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
    
    it("should return a size by ID", async () => {
        const response = await request(app).get("/api/sizes/DqClNoblfJUfQJaoieLv")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 'DqClNoblfJUfQJaoieLv');
    });
    
    it("should return 404 for non-existing size", async () => {
        const response = await request(app).get("/api/sizes/9999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(404);
    });

    
    it("should create a new size", async () => {
        const newSize = {
            descripcion: "TestSize",
            tags: ["test", "test"],
        };
        const response = await request(app).post("/api/sizes")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newSize);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.descripcion).toBe('TestSize');
        expect(response.body.id).toBeDefined();
        sizeId = response.body.id; // guarda el ID del nuevo tamaño
    });

    it("should update an existing size", async () => {
        const updatedSize = {
            id: sizeId,
            descripcion: "TestSize",
            tags: ["test", "test", "updated"],
        };
        const response = await request(app).patch(`/api/sizes/${sizeId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedSize);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', sizeId);
        expect(response.body.tags.length).toBe(3);
    });

    it("should update status an existing size", async () => {
        const response = await request(app).put(`/api/sizes/${sizeId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send({estatus: false});
        expect(response.status).toBe(204);
    });

    it("should delete an existing size", async () => {
        const response = await request(app).delete(`/api/sizes/${sizeId}`)
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(204);
    });
});