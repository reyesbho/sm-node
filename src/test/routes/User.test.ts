import request from "supertest";
import app from "../setup.js";

let userId: string;
let authCookie: string;
describe("User Authentication", () => {
    it("should register a new user", async () => {
        const newUser = {
            "email":"test1@test.com",
            "password":"HolaMundo123*",
            "fullName":"Test user1"
        };
        
        const response = await request(app)
            .post("/user/register")
            .send(newUser);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('email', newUser.email);
        expect(response.body).toHaveProperty('rol.clave','USER' );
        expect(response.body).toHaveProperty('fullName',newUser.fullName);
        userId = response.body.id;
    });

    it("should login with valid credentials", async () => {
        const loginData = {
            email: "test1@test.com",
            password: "HolaMundo123*"
        };
        
        const response = await request(app)
            .post("/user/login")
            .send(loginData);
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
        expect(response.body.user).toBeDefined();
        expect(response.headers['set-cookie']).toBeDefined();
        
        // Guardar el token para otros tests
        authCookie = response.body.token;
    });

    it("should fail login with invalid credentials", async () => {
        const invalidLoginData = {
            email: "test1@test.com",
            password: "WrongPassword123*"
        };
        
        const response = await request(app)
            .post("/user/login")
            .send(invalidLoginData);
            
        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Authentication failed');
    });

    it("should fail login with invalid email format", async () => {
        const invalidEmailData = {
            email: "invalid-email",
            password: "HolaMundo123*"
        };
        
        const response = await request(app)
            .post("/user/login")
            .send(invalidEmailData);
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it("should fail login with missing password", async () => {
        const missingPasswordData = {
            email: "test1@test.com"
        };
        
        const response = await request(app)
            .post("/user/login")
            .send(missingPasswordData);
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it("should logout successfully", async () => {
        // Primero hacer login para obtener cookies
        const loginResponse = await request(app)
            .post("/user/login")
            .send({
                email: "test1@test.com",
                password: "HolaMundo123*"
            });
            
        expect(loginResponse.status).toBe(200);
        
        // Luego hacer logout
        const response = await request(app)
            .post("/user/logout");
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Succefull logout');
    });

    it("should fail registration with invalid email format", async () => {
        const invalidUser = {
            email: "invalid-email",
            password: "ValidPassword123*"
        };
        
        const response = await request(app)
            .post("/user/register")
            .send(invalidUser);
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it("should fail registration with weak password", async () => {
        const weakPasswordUser = {
            email: "test2@test.com",
            password: "123"
        };
        
        const response = await request(app)
            .post("/user/register")
            .send(weakPasswordUser);
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it("should fail registration with missing fields", async () => {
        const incompleteUser = {
            email: "test3@test.com"
            // password missing
        };
        
        const response = await request(app)
            .post("/user/register")
            .send(incompleteUser);
            
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
    });

    it("should delete user", async () => {
        const response = await request(app)
        .delete(`/user/${userId}`)
        .set('Cookie', `access_token=${authCookie}`);
        
        expect(response.status).toBe(204);
    });
});
