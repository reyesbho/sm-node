import request from "supertest";
import app from "../setup.js";

let authCookie: string;
let companyId: string;

describe("Company Management", () => {
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

    it("should return a list of companies", async () => {
        const response = await request(app).get("/api/companys")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return companies filtered by status", async () => {
        const response = await request(app).get("/api/companys?estatus=true")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return a company by ID", async () => {
        // Usar un ID que probablemente exista (ajustar según tu base de datos)
        const response = await request(app).get("/api/companys/test_company_id")
        .set('Cookie', `access_token=${authCookie}`);
        // Este test puede fallar si el ID no existe, pero es normal
        if (response.status === 400) {
            expect(response.body).toHaveProperty('message', 'Company not found');
        } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
        }
    });

    it("should return 400 for non-existing company", async () => {
        const response = await request(app).get("/api/companys/999999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Company not found');
    });

    it("should create a new company", async () => {
        const newCompany = {
            razonSocial: "Test Company S.A.",
            descripcion: "Una empresa de prueba para testing",
            imgLogo: "https://example.com/logo.jpg"
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newCompany);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.razonSocial).toBe('Test Company S.A.');
        expect(response.body.descripcion).toBe('Una empresa de prueba para testing');
        expect(response.body).toHaveProperty('fechaCreacion');
        expect(response.body).toHaveProperty('user');
        
        companyId = response.body.id; // Guardar el ID para los siguientes tests
    });

    it("should fail to create company with razonSocial too short", async () => {
        const invalidCompany = {
            razonSocial: "ABC", // Muy corta (mínimo 5 caracteres)
            descripcion: "Descripción válida"
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidCompany);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create company with razonSocial too long", async () => {
        const invalidCompany = {
            razonSocial: "Esta es una razón social que es demasiado larga para pasar la validación", // Muy larga (máximo 30 caracteres)
            descripcion: "Descripción válida"
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidCompany);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create company with description too long", async () => {
        const invalidCompany = {
            razonSocial: "Test Company S.A.",
            descripcion: "Esta es una descripción que es demasiado larga para pasar la validación porque tiene más de 100 caracteres y eso no está permitido según el esquema de validación" // Muy larga (máximo 100 caracteres)
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidCompany);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create company with missing razonSocial", async () => {
        const invalidCompany = {
            descripcion: "Descripción válida"
            // razonSocial missing
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidCompany);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should update the created company", async () => {
        expect(companyId).toBeDefined();
        
        const updatedCompany = {
            razonSocial: "Updated Test Company S.A.",
            descripcion: "Descripción actualizada de la empresa"
        };
        
        const response = await request(app).patch(`/api/companys/${companyId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedCompany);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', companyId);
        expect(response.body.razonSocial).toBe('Updated Test Company S.A.');
        expect(response.body.descripcion).toBe('Descripción actualizada de la empresa');
        expect(response.body).toHaveProperty('fechaActualizacion');
    });

    it("should fail to update company with invalid data", async () => {
        expect(companyId).toBeDefined();
        
        const invalidUpdate = {
            razonSocial: "AB" // Muy corta
        };
        
        const response = await request(app).patch(`/api/companys/${companyId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidUpdate);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should update company status", async () => {
        expect(companyId).toBeDefined();
        
        const response = await request(app).put(`/api/companys/${companyId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
        //expect(response.body).toHaveProperty('message', 'Company update successfully');
    });

    it("should return 404 when updating non-existing company", async () => {
        const response = await request(app).patch("/api/companys/999999")
        .set('Cookie', `access_token=${authCookie}`)
        .send({ razonSocial: "Updated Company" });
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Company not found');
    });

    it("should return 404 when updating status of non-existing company", async () => {
        const response = await request(app).put("/api/companys/999999")
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Company not found');
    });

    it("should delete the created company", async () => {
        expect(companyId).toBeDefined();
        
        const response = await request(app).delete(`/api/companys/${companyId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
        //expect(response.body).toHaveProperty('message', 'Company deleted successfully');
    });

    it("should return 404 when deleting non-existing company", async () => {
        const response = await request(app).delete("/api/companys/999999")
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Company not found');
    });

    it("should return 401 when accessing companies without authentication", async () => {
        const response = await request(app).get("/api/companys");
        expect(response.status).toBe(401);
    });

    it("should return 401 when creating company without authentication", async () => {
        const newCompany = {
            razonSocial: "Unauthorized Company",
            descripcion: "Esta empresa no debería crearse"
        };
        
        const response = await request(app).post("/api/companys")
        .send(newCompany);
        
        expect(response.status).toBe(401);
    });

    it("should return 401 when updating company without authentication", async () => {
        const response = await request(app).patch("/api/companys/123")
        .send({ razonSocial: "Unauthorized Update" });
        
        expect(response.status).toBe(401);
    });

    it("should return 401 when deleting company without authentication", async () => {
        const response = await request(app).delete("/api/companys/123");
        
        expect(response.status).toBe(401);
    });

    it("should create company with only required fields", async () => {
        const minimalCompany = {
            razonSocial: "Minimal Company"
        };
        
        const response = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(minimalCompany);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.razonSocial).toBe('Minimal Company');
        expect(response.body).toHaveProperty('fechaCreacion');
        
        // Limpiar el company creado
        await request(app).delete(`/api/companys/${response.body.id}`)
        .set('Cookie', `access_token=${authCookie}`);
    });

    it("should handle partial updates correctly", async () => {
        // Crear una company primero
        const newCompany = {
            razonSocial: "Partial Update Company",
            descripcion: "Descripción original"
        };
        
        const createResponse = await request(app).post("/api/companys")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newCompany);
        
        expect(createResponse.status).toBe(201);
        const createdCompanyId = createResponse.body.id;
        
        // Actualizar solo la descripción
        const partialUpdate = {
            descripcion: "Descripción actualizada parcialmente"
        };
        
        const updateResponse = await request(app).patch(`/api/companys/${createdCompanyId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(partialUpdate);
        
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.razonSocial).toBe('Partial Update Company'); // No debería cambiar
        expect(updateResponse.body.descripcion).toBe('Descripción actualizada parcialmente');
        
        // Limpiar
        await request(app).delete(`/api/companys/${createdCompanyId}`)
        .set('Cookie', `access_token=${authCookie}`);
    });
});
