import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

/* -----------------------------------------------
   Security Scheme
----------------------------------------------- */
registry.registerComponent('securitySchemes', 'cookieAuth', {
  type: 'apiKey',
  in: 'cookie',
  name: 'access_token',
  description: 'Cookie HTTP-only establecida al iniciar sesión',
});

/* -----------------------------------------------
   Schemas compartidos
----------------------------------------------- */
const TimestampSchema = registry.register(
  'Timestamp',
  z.object({
    seconds: z.number().openapi({ example: 1700000000 }),
    nanoseconds: z.number().openapi({ example: 0 }),
  }).openapi({ description: 'Firestore Timestamp' })
);

const SizeSchema = registry.register(
  'Size',
  z.object({
    size: z.enum(['Chica', 'Mediana', 'Grande', 'Familiar', 'Mini', 'Por defecto'])
      .openapi({ example: 'Mediana' }),
    price: z.number().nonnegative().openapi({ example: 250 }),
  })
);

const ProductSchema = registry.register(
  'Product',
  z.object({
    id: z.string().openapi({ example: 'abc123' }),
    name: z.string().openapi({ example: 'Pastel de chocolate' }),
    descripcion: z.string().openapi({ example: 'Delicioso pastel de chocolate negro' }),
    imagen: z.string().nullable().optional()
      .openapi({ example: 'https://bucket.s3.amazonaws.com/images/pastel.jpg' }),
    estatus: z.boolean().openapi({ example: true }),
    sizes: z.array(SizeSchema),
    category: z.string().optional().openapi({ example: 'pasteles' }),
  })
);

const ProductCreateSchema = registry.register(
  'ProductCreate',
  z.object({
    name: z.string().min(3).openapi({ example: 'Pastel de chocolate' }),
    descripcion: z.string().max(200).openapi({ example: 'Delicioso pastel de chocolate negro' }),
    imagen: z.string().nullable().optional().openapi({ example: null }),
    estatus: z.boolean().default(true).openapi({ example: true }),
    sizes: z.array(SizeSchema).min(1),
    category: z.string().max(20).optional().openapi({ example: 'pasteles' }),
  })
);

const CategorySchema = registry.register(
  'Category',
  z.object({
    id: z.string().openapi({ example: 'cat123' }),
    descripcion: z.string().openapi({ example: 'pasteles_frios' }),
  })
);

const ProductoPedidoSchema = registry.register(
  'ProductoPedido',
  z.object({
    id: z.string().openapi({ example: 'item123' }),
    cantidad: z.number().int().positive().openapi({ example: 2 }),
    size: z.object({
      size: z.string().openapi({ example: 'Mediana' }),
      price: z.number().openapi({ example: 250 }),
    }),
    producto: z.object({
      id: z.string().openapi({ example: 'prod123' }),
      name: z.string().openapi({ example: 'Pastel de chocolate' }),
      imagen: z.string().nullable().optional(),
    }),
    caracteristicas: z.string().optional().openapi({ example: 'Sin gluten' }),
    subtotal: z.number().positive().openapi({ example: 500 }),
  })
);

const PedidoSchema = registry.register(
  'Pedido',
  z.object({
    id: z.string().openapi({ example: 'ped123' }),
    fechaEntrega: TimestampSchema,
    fechaCreacion: TimestampSchema,
    fechaActualizacion: TimestampSchema,
    lugarEntrega: z.string().optional().openapi({ example: 'Domicilio del cliente' }),
    cliente: z.string().openapi({ example: 'Juan Pérez' }),
    clienteLower: z.string().openapi({ example: 'juan pérez' }),
    productos: z.array(ProductoPedidoSchema),
    estatus: z.enum(['TODO', 'DONE', 'CANCELED', 'DELETE']).openapi({ example: 'TODO' }),
    estatusPago: z.enum(['PENDIENTE', 'PAGADO', 'ABONADO']).openapi({ example: 'PENDIENTE' }),
    tipoPago: z.enum(['EFECTIVO', 'TRANSFERENCIA']).optional().openapi({ example: 'EFECTIVO' }),
    abonos: z.array(z.object({
      monto: z.number().positive().openapi({ example: 250 }),
      fecha: TimestampSchema,
    })).optional(),
    total: z.number().positive().openapi({ example: 1000 }),
    detalles: z.string().optional(),
    registradoPor: z.string().openapi({ example: 'user@example.com' }),
    actualizadoPor: z.string().openapi({ example: 'user@example.com' }),
  })
);

const PedidoCreateSchema = registry.register(
  'PedidoCreate',
  z.object({
    fechaEntrega: TimestampSchema,
    lugarEntrega: z.string().optional().openapi({ example: 'Domicilio del cliente' }),
    cliente: z.string().min(5).openapi({ example: 'Juan Pérez' }),
    clienteLower: z.string().openapi({ example: 'juan pérez' }),
    productos: z.array(ProductoPedidoSchema).min(1),
    estatus: z.enum(['TODO', 'DONE', 'CANCELED', 'DELETE']).openapi({ example: 'TODO' }),
    estatusPago: z.enum(['PENDIENTE', 'PAGADO', 'ABONADO']).openapi({ example: 'PENDIENTE' }),
    tipoPago: z.enum(['EFECTIVO', 'TRANSFERENCIA']).optional().openapi({ example: 'EFECTIVO' }),
    abonos: z.array(z.object({
      monto: z.number().positive().openapi({ example: 250 }),
      fecha: TimestampSchema,
    })).optional(),
    total: z.number().positive().openapi({ example: 1000 }),
    detalles: z.string().optional().openapi({ example: 'Sin nueces' }),
  })
);

const ResumeSchema = registry.register(
  'Resume',
  z.object({
    pedidosTotales: z.number().openapi({ example: 50 }),
    porHacer: z.number().openapi({ example: 10 }),
    entregados: z.number().openapi({ example: 35 }),
    cancelados: z.number().openapi({ example: 5 }),
    totalDelMes: z.number().openapi({ example: 15000 }),
    totalCancelado: z.number().openapi({ example: 2500 }),
    totalEcho: z.number().openapi({ example: 10000 }),
    totalPorHacer: z.number().openapi({ example: 2500 }),
  })
);

const ErrorSchema = registry.register(
  'Error',
  z.object({
    message: z.string().openapi({ example: 'Unauthorized' }),
  })
);

/* -----------------------------------------------
   Paths - Auth
----------------------------------------------- */
registry.registerPath({
  method: 'post',
  path: '/api/user/register',
  tags: ['Auth'],
  summary: 'Registrar nuevo usuario',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            fullName: z.string().max(50).openapi({ example: 'Juan Pérez' }),
            email: z.string().email().openapi({ example: 'juan@example.com' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Usuario registrado correctamente' },
    400: {
      description: 'Datos inválidos',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/user/auth',
  tags: ['Auth'],
  summary: 'Iniciar sesión con Firebase ID Token',
  description: 'Recibe el idToken generado por Firebase en el cliente y establece una cookie HTTP-only.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            idToken: z.string().openapi({ example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' }),
          }),
        },
      },
    },
  },
  responses: {
    200: { description: 'Sesión iniciada, cookie access_token establecida' },
    401: {
      description: 'Token inválido',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
});

/* -----------------------------------------------
   Paths - Productos
----------------------------------------------- */
registry.registerPath({
  method: 'get',
  path: '/api/productos',
  tags: ['Productos'],
  summary: 'Obtener todos los productos',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Lista de productos',
      content: { 'application/json': { schema: z.array(ProductSchema) } },
    },
    401: { description: 'No autenticado' },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/productos/{id}',
  tags: ['Productos'],
  summary: 'Obtener producto por ID',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'abc123' }) }),
  },
  responses: {
    200: {
      description: 'Producto encontrado',
      content: { 'application/json': { schema: ProductSchema } },
    },
    404: { description: 'Producto no encontrado' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/productos',
  tags: ['Productos'],
  summary: 'Crear nuevo producto',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: ProductCreateSchema } },
    },
  },
  responses: {
    201: {
      description: 'Producto creado',
      content: { 'application/json': { schema: ProductSchema } },
    },
    400: { description: 'Datos inválidos' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/productos/{id}',
  tags: ['Productos'],
  summary: 'Actualizar producto parcialmente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'abc123' }) }),
    body: {
      content: { 'application/json': { schema: ProductCreateSchema.partial() } },
    },
  },
  responses: {
    200: {
      description: 'Producto actualizado',
      content: { 'application/json': { schema: ProductSchema } },
    },
    404: { description: 'Producto no encontrado' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/productos/{id}',
  tags: ['Productos'],
  summary: 'Eliminar producto',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'abc123' }) }),
  },
  responses: {
    200: { description: 'Producto eliminado' },
    404: { description: 'Producto no encontrado' },
  },
});

/* -----------------------------------------------
   Paths - Categorías
----------------------------------------------- */
registry.registerPath({
  method: 'get',
  path: '/api/categories',
  tags: ['Categorías'],
  summary: 'Obtener todas las categorías',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Lista de categorías',
      content: { 'application/json': { schema: z.array(CategorySchema) } },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/categories',
  tags: ['Categorías'],
  summary: 'Crear nueva categoría',
  description: 'La descripción solo acepta letras minúsculas y guion bajo (ej: pasteles_frios).',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({
            descripcion: z.string().max(200).openapi({ example: 'pasteles_frios' }),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Categoría creada',
      content: { 'application/json': { schema: CategorySchema } },
    },
    400: { description: 'Datos inválidos' },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/categories/{id}',
  tags: ['Categorías'],
  summary: 'Eliminar categoría',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'cat123' }) }),
  },
  responses: {
    200: { description: 'Categoría eliminada' },
    404: { description: 'Categoría no encontrada' },
  },
});

/* -----------------------------------------------
   Paths - Pedidos
----------------------------------------------- */
registry.registerPath({
  method: 'get',
  path: '/api/pedidos',
  tags: ['Pedidos'],
  summary: 'Obtener todos los pedidos (paginado)',
  security: [{ cookieAuth: [] }],
  request: {
    query: z.object({
      pageSize: z.string().optional().openapi({ example: '10' }),
      cursorFechaCreacion: z.string().optional()
        .openapi({ example: '2024-01-01T00:00:00.000Z' }),
    }),
  },
  responses: {
    200: {
      description: 'Lista de pedidos',
      content: { 'application/json': { schema: z.array(PedidoSchema) } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/pedidos/resume',
  tags: ['Pedidos'],
  summary: 'Resumen estadístico de pedidos del mes',
  security: [{ cookieAuth: [] }],
  responses: {
    200: {
      description: 'Resumen de pedidos',
      content: { 'application/json': { schema: ResumeSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/pedidos/{id}',
  tags: ['Pedidos'],
  summary: 'Obtener pedido por ID',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'ped123' }) }),
  },
  responses: {
    200: {
      description: 'Pedido encontrado',
      content: { 'application/json': { schema: PedidoSchema } },
    },
    404: { description: 'Pedido no encontrado' },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/pedidos',
  tags: ['Pedidos'],
  summary: 'Crear nuevo pedido',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: { 'application/json': { schema: PedidoCreateSchema } },
    },
  },
  responses: {
    201: {
      description: 'Pedido creado',
      content: { 'application/json': { schema: PedidoSchema } },
    },
    400: { description: 'Datos inválidos' },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/pedidos/{id}',
  tags: ['Pedidos'],
  summary: 'Actualizar pedido parcialmente',
  security: [{ cookieAuth: [] }],
  request: {
    params: z.object({ id: z.string().openapi({ example: 'ped123' }) }),
    body: {
      content: { 'application/json': { schema: PedidoCreateSchema.partial() } },
    },
  },
  responses: {
    200: {
      description: 'Pedido actualizado',
      content: { 'application/json': { schema: PedidoSchema } },
    },
    404: { description: 'Pedido no encontrado' },
  },
});

/* -----------------------------------------------
   Paths - Público
----------------------------------------------- */
registry.registerPath({
  method: 'get',
  path: '/api/public/pedidos',
  tags: ['Público'],
  summary: 'Ver pedidos públicamente (sin autenticación)',
  responses: {
    200: {
      description: 'Lista de pedidos públicos',
      content: { 'application/json': { schema: z.array(PedidoSchema) } },
    },
  },
});

/* -----------------------------------------------
   Paths - Archivos
----------------------------------------------- */
registry.registerPath({
  method: 'post',
  path: '/api/files',
  tags: ['Archivos'],
  summary: 'Subir imagen a AWS S3',
  description: 'Recibe una imagen en formato multipart/form-data y la sube al bucket S3. Tamaño máximo: 5MB.',
  security: [{ cookieAuth: [] }],
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: z.object({
            file: z.any().openapi({
              type: 'string',
              format: 'binary',
              description: 'Imagen a subir (max 5MB)',
            }),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'URL pública del archivo subido',
      content: {
        'application/json': {
          schema: z.object({
            url: z.string().url().openapi({
              example: 'https://bucket.s3.amazonaws.com/images/file.jpg',
            }),
          }),
        },
      },
    },
    401: { description: 'No autenticado' },
  },
});
