import request from "supertest";
import app from "../setup.js";

let authCookie: string;
let roleId: string; // Mover la variable al scope del describe

describe("Catalogs roles", () => {
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

    it("should return a list of roles", async () => {
        const response = await request(app).get("/api/roles")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return a role by ID", async () => {
        const response = await request(app).get("/api/roles/Guf0mQWS0gkaHByWogZO")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 'Guf0mQWS0gkaHByWogZO');
    });

    it("should return 404 for non-existing role", async () => {
        const response = await request(app).get("/api/roles/9999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(404);
    });

    // FLUJO PRINCIPAL: CREATE -> UPDATE -> DELETE
    it("should create a new role", async () => {
        const newRole = {
            descripcion: "TestRole",
            clave: "TESTROLE",
        };
        const response = await request(app).post("/api/roles")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newRole);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.descripcion).toBe('TestRole');
        
        roleId = response.body.id; // Guardar el ID para los siguientes tests
        expect(roleId).toBeDefined(); // Verificar que se guardó correctamente
    });

    it("should update the created role", async () => {
        // Verificar que tenemos un roleId del test anterior
        expect(roleId).toBeDefined();
        console.log("Updating role with ID:", roleId);
        
        const updatedRole = {
            descripcion: "UpdatedTestRole",
            clave: "UPDATEDTESTROLE",
        };
        const response = await request(app).patch(`/api/roles/${roleId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedRole);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', roleId);
        expect(response.body.descripcion).toBe('UpdatedTestRole');
    });   

    it("should delete the created role", async () => {
        // Verificar que tenemos un roleId del test anterior
        expect(roleId).toBeDefined();
        
        const response = await request(app).delete(`/api/roles/${roleId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
    });

    // Test adicional para verificar que el rol fue eliminado
    it("should return 404 for the deleted role", async () => {
        expect(roleId).toBeDefined();
        
        const response = await request(app).get(`/api/roles/${roleId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(404);
    });
});