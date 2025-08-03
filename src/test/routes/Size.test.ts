
import request from 'supertest';
import server from '../../../server.js';

afterAll(() => {
  server.server.close(); 
});

let authCookie: string;
describe("Catalogs sizes", () => {
    it("should authtenticate the request", async () => {
        const response = await request(server.app).post("/user/login")
        .send(
            {
                "email":"test@test.com",
                "password":"HolaMundo123*"
            }
        );
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
        // guarda la cookie del login
        authCookie = response.body.token;
    });

    it("should return a list of sizes", async () => {
        const response = await request(server.app).get("/api/sizes")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
    
    it("should return a size by ID", async () => {
        const response = await request(server.app).get("/api/sizes/F5kvF254DPYGgwv6yuj7")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 'F5kvF254DPYGgwv6yuj7');
    });
    
    it("should return 404 for non-existing size", async () => {
        const response = await request(server.app).get("/api/sizes/9999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(404);
    });

    let sizeId: string;
    it("should create a new size", async () => {
        const newSize = {
            descripcion: "TestSize",
            tags: ["test", "test"],
        };
        const response = await request(server.app).post("/api/sizes")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newSize);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.descripcion).toBe('TestSize');
        sizeId = response.body.id; // guarda el ID del nuevo tamaño
    });

    it("should update an existing size", async () => {
        const updatedSize = {
            id: sizeId,
            descripcion: "TestSize",
            tags: ["test", "test", "updated"],
        };
        const response = await request(server.app).patch(`/api/sizes/${sizeId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedSize);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', sizeId);
        expect(response.body.tags.length).toBe(3);
    });

    it("should update status an existing size", async () => {
        const response = await request(server.app).put(`/api/sizes/${sizeId}`)
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(204);
        expect(response.body).toHaveProperty('id', sizeId);
    });
});