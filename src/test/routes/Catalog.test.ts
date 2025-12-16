import request from "supertest";
import app from "../setup.js";

describe("Catalog APIs", () => {
    let authCookie: string;

    // Ejecutar autenticación antes de todos los tests
    beforeAll(async () => {
        const response = await request(app)
            .post("/user/login")
            .send({
                "email": "test@test.com",
                "password": "HolaMundo123*"
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
        authCookie = response.body.token;
    });

    describe("GET /api/catalogos", () => {
        it("should get all catalogs", async () => {
            const response = await request(app)
                .get("/api/catalogos")
                .set('Authorization', `Bearer ${authCookie}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should get catalogs with estatus filter", async () => {
            const response = await request(app)
                .get("/api/catalogos?estatus=active")
                .set('Authorization', `Bearer ${authCookie}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

        it("should fail when not authenticated", async () => {
            const response = await request(app)
                .get("/api/catalogos");

            expect(response.status).toBe(401);
        });
    });

    describe("GET /api/catalogos/:idCatalog", () => {
        it("should get a specific catalog by ID", async () => {
            // Primero obtenemos todos los catálogos
            const allResponse = await request(app)
                .get("/api/catalogos")
                .set('Authorization', `Bearer ${authCookie}`);

            expect(allResponse.status).toBe(200);
            
            // Si hay catálogos, probamos con el primero
            if (allResponse.body.length > 0) {
                const catalogId = allResponse.body[0].id;
                
                const response = await request(app)
                    .get(`/api/catalogos/${catalogId}`)
                    .set('Authorization', `Bearer ${authCookie}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('id', catalogId);
            }
        });

        it("should return 404 for non-existent catalog", async () => {
            const response = await request(app)
                .get("/api/catalogos/nonexistent-id")
                .set('Authorization', `Bearer ${authCookie}`);

            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('message', 'Catalog not found');
        });

        it("should fail when not authenticated", async () => {
            const response = await request(app)
                .get("/api/catalogos/some-id");

            expect(response.status).toBe(401);
        });
    });
});
