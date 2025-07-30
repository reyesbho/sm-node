import app from '../../../server';
import request from 'supertest';

describe("GET /api/sizes", () => {
    it("should return a list of sizes", async () => {
        const response = await request(app).get("/api/sizes");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
    
    it("should return a size by ID", async () => {
        const response = await request(app).get("/api/sizes/F5kvF254DPYGgwv6yuj7");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 'F5kvF254DPYGgwv6yuj7');
    });
    
    it("should return 404 for non-existing size", async () => {
        const response = await request(app).get("/api/sizes/9999");
        expect(response.status).toBe(404);
    });
})