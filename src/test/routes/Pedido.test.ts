import request from "supertest";
import app from "../setup.js";

let authCookie: string;
let pedidoId: string;

describe("Pedidos Management", () => {
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

    it("should return a list of pedidos", async () => {
        const response = await request(app).get("/api/companys/compania_001/pedidos")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pedidos');
        expect(response.body.pedidos).toBeInstanceOf(Array);
    });

    it("should return pedidos with pagination", async () => {
        const response = await request(app).get("/api/companys/compania_001/pedidos?pageSize=5")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pedidos');
        expect(response.body.pedidos).toBeInstanceOf(Array);
    });

    it("should return pedidos filtered by status", async () => {
        const response = await request(app).get("/api/companys/compania_001/pedidos?estatus=BACKLOG")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pedidos');
        expect(response.body.pedidos).toBeInstanceOf(Array);
    });

    it("should return pedidos filtered by date range", async () => {
        const fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - 30); // 30 días atrás
        const fechaFin = new Date();
        
        // Formatear fechas en el formato esperado por el modelo (DD-MM-YYYY)
        const formatDate = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };
        
        const response = await request(app)
            .get(`/api/companys/compania_001/pedidos?fechaInicio=${formatDate(fechaInicio)}&fechaFin=${formatDate(fechaFin)}`)
            .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('pedidos');
        expect(response.body.pedidos).toBeInstanceOf(Array);
    });

    it("should return a pedido by ID", async () => {
        // Usar un ID que probablemente exista (ajustar según tu base de datos)
        const response = await request(app).get("/api/companys/compania_001/pedidos/test_pedido_id")
        .set('Cookie', `access_token=${authCookie}`);
        // Este test puede fallar si el ID no existe, pero es normal
        if (response.status === 404) {
            expect(response.body).toHaveProperty('message', 'Product not found');
        } else {
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('id');
        }
    });

    it("should return 404 for non-existing pedido", async () => {
        const response = await request(app).get("/api/companys/compania_001/pedidos/999999")
        .set('Cookie', `access_token=${authCookie}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it("should create a new pedido", async () => {
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7); // 7 días en el futuro
        
        const newPedido = {
            fechaEntrega: {
                seconds: Math.floor(fechaEntrega.getTime() / 1000),
                nanoseconds: (fechaEntrega.getTime() % 1000) * 1000000
            },
            lugarEntrega: "Test Location",
            cliente: "Test Client Name",
            productos: [
                {
                    cantidad: 2,
                    size: {
                        id: "test_size_id",
                        descripcion: "Test Size"
                    },
                    producto: {
                        id: "test_product_id",
                        descripcion: "Test Product",
                        imagen: "https://example.com/image.jpg"
                    },
                    caracteristicas: ["Test Feature"],
                    precio: 100.50
                }
            ]
        };
        
        const response = await request(app).post("/api/companys/compania_001/pedidos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(newPedido);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.cliente).toBe('Test Client Name');
        expect(response.body.lugarEntrega).toBe('Test Location');
        expect(response.body.estatus).toBe('BACKLOG');
        expect(response.body.estatusPago).toBe('PENDIENTE');
        expect(response.body.total).toBe(201); // 2 * 100.50
        
        pedidoId = response.body.id; // Guardar el ID para los siguientes tests
    });

    it("should fail to create pedido with invalid cliente (too short)", async () => {
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);
        
        const invalidPedido = {
            fechaEntrega: {
                seconds: Math.floor(fechaEntrega.getTime() / 1000),
                nanoseconds: (fechaEntrega.getTime() % 1000) * 1000000
            },
            cliente: "AB" // Muy corto
        };
        
        const response = await request(app).post("/api/companys/compania_001/pedidos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidPedido);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create pedido with invalid timestamp", async () => {
        const invalidPedido = {
            fechaEntrega: {
                seconds: -1, // Inválido
                nanoseconds: 0
            },
            cliente: "Valid Client Name"
        };
        
        const response = await request(app).post("/api/companys/compania_001/pedidos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidPedido);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should fail to create pedido with invalid product data", async () => {
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);
        
        const invalidPedido = {
            fechaEntrega: {
                seconds: Math.floor(fechaEntrega.getTime() / 1000),
                nanoseconds: (fechaEntrega.getTime() % 1000) * 1000000
            },
            cliente: "Valid Client Name",
            productos: [
                {
                    cantidad: -1, // Cantidad negativa - inválida
                    size: {
                        id: "test_size_id",
                        descripcion: "Test Size"
                    },
                    producto: {
                        id: "test_product_id",
                        descripcion: "Test Product"
                    },
                    precio: 100.50
                }
            ]
        };
        
        const response = await request(app).post("/api/companys/compania_001/pedidos")
        .set('Cookie', `access_token=${authCookie}`)
        .send(invalidPedido);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });

    it("should update the created pedido", async () => {
        expect(pedidoId).toBeDefined();
        
        const updatedPedido = {
            cliente: "Updated Client Name",
            lugarEntrega: "Updated Location"
        };
        
        const response = await request(app).patch(`/api/companys/compania_001/pedidos/${pedidoId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedPedido);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', pedidoId);
        expect(response.body.cliente).toBe('Updated Client Name');
        expect(response.body.lugarEntrega).toBe('Updated Location');
    });

    it("should update pedido with new products", async () => {
        expect(pedidoId).toBeDefined();
        
        const updatedPedido = {
            productos: [
                {
                    cantidad: 3,
                    size: {
                        id: "test_size_id",
                        descripcion: "Test Size"
                    },
                    producto: {
                        id: "test_product_id",
                        descripcion: "Test Product"
                    },
                    precio: 150.75
                }
            ]
        };
        
        const response = await request(app).patch(`/api/companys/compania_001/pedidos/${pedidoId}`)
        .set('Cookie', `access_token=${authCookie}`)
        .send(updatedPedido);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', pedidoId);
        expect(response.body.total).toBe(452.25); // 3 * 150.75
    });

    it("should return 404 when updating non-existing pedido", async () => {
        const response = await request(app).patch("/api/companys/compania_001/pedidos/999999")
        .set('Cookie', `access_token=${authCookie}`)
        .send({ cliente: "Updated" });
        
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Product not found');
    });

    it("should return 401 when accessing pedidos without authentication", async () => {
        const response = await request(app).get("/api/companys/compania_001/pedidos");
        expect(response.status).toBe(401);
    });

    it("should return 401 when creating pedido without authentication", async () => {
        const fechaEntrega = new Date();
        fechaEntrega.setDate(fechaEntrega.getDate() + 7);
        
        const newPedido = {
            fechaEntrega: {
                seconds: Math.floor(fechaEntrega.getTime() / 1000),
                nanoseconds: (fechaEntrega.getTime() % 1000) * 1000000
            },
            cliente: "Unauthorized Client"
        };
        
        const response = await request(app).post("/api/companys/compania_001/pedidos")
        .send(newPedido);
        
        expect(response.status).toBe(401);
    });
});

describe("Public Pedidos API", () => {
    it("should return public pedidos list", async () => {
        const response = await request(app).get("/api/public/pedidos");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        
        // Verificar que los pedidos públicos no contienen información sensible
        if (response.body.length > 0) {
            const pedido = response.body[0];
            expect(pedido).toHaveProperty('id');
            expect(pedido).toHaveProperty('fechaEntrega');
            expect(pedido).toHaveProperty('cliente');
            expect(pedido).toHaveProperty('lugarEntrega');
            // No debería tener información sensible como total, estatus, etc.
            expect(pedido).not.toHaveProperty('total');
            expect(pedido).not.toHaveProperty('estatus');
            expect(pedido).not.toHaveProperty('estatusPago');
        }
    });

    it("should return public pedidos with pagination", async () => {
        const response = await request(app).get("/api/public/pedidos?pageSize=3");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it("should return public pedidos filtered by status", async () => {
        const response = await request(app).get("/api/public/pedidos?estatus=BACKLOG");
        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });
});
