# API Documentation - Sweet Moments

## Descripción del Proyecto

API RESTful backend para la plataforma Sweet Moments, desarrollada con:
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **Base de Datos:** Firebase Firestore
- **Almacenamiento:** AWS S3 para imágenes
- **Autenticación:** Firebase Authentication + Session Cookies
- **Validación:** Zod

## Base URL
```
http://localhost:3000/api
```

### Estructura de Base URL
Todos los endpoints están bajo la ruta `/api`:
- Rutas públicas: `/api/user`, `/api/public/pedidos`, `/api/seed`
- Rutas protegidas: `/api/productos`, `/api/pedidos`, `/api/categories`, `/api/files`

## Autenticación
La mayoría de los endpoints requieren autenticación. Después del login, el servidor establece cookies HTTP-only con tokens de acceso. Incluye estas cookies en las siguientes solicitudes.

**Rutas Públicas (sin autenticación requerida):**
- `POST /user/register` - Registrar usuario
- `POST /user/auth` - Login
- `GET /public/pedidos` - Ver pedidos públicos
- `POST /seed` - Cargar datos iniciales

**Rutas Protegidas (requieren autenticación):**
- `/productos` - Gestión de productos
- `/pedidos` - Gestión de pedidos
- `/categories` - Gestión de categorías
- `/files` - Gestión de archivos

---

## Endpoints

### 1. User Management

#### 1.1 User Registration
**POST** `/user/register`

Registrar una nueva cuenta de usuario.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Validación:**
- `email`: Formato válido de email
- `password`: Mínimo 8 caracteres, debe contener mayúsculas, minúsculas, números y caracteres especiales

**Response (201):**
```json
{
  "uid": "user_id",
  "email": "user@example.com"
}
```

**Error Response (400):**
```json
{
  "message": "Validation error details"
}
```

---

#### 1.2 User Login
**POST** `/user/auth`

Autenticar usuario y recibir token de acceso.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "token": "access_token_string",
  "uid": "user_id"
}
```

**Cookies Establecidas:**
- `access_token`: HTTP-only cookie

**Error Response (401):**
```json
{
  "message": "Invalid credentials"
}
```



---

### 2. Products Management

**Base URL:** `/productos`

*Todos los endpoints requieren autenticación*

#### 2.1 Get All Products
**GET** `/productos`

Obtener todos los productos. Soporta filtrado por tag, estatus y categoría.

**Query Parameters (opcionales):**
- `tag`: Filtrar por tamaño (Chica, Mediana, Grande, Familiar, Mini, Por defecto)
- `estatus`: Filtrar por estatus (true/false)
- `category`: Filtrar por categoría

**Response (200):**
```json
[
  {
    "id": "product_id",
    "name": "Nombre del producto",
    "descripcion": "Descripción del producto",
    "imagen": "image_url",
    "estatus": true,
    "sizes": [
      {
        "size": "Mediana",
        "price": 25.99
      }
    ],
    "category": "category_name"
  }
]
```

---

#### 2.2 Get Product by ID
**GET** `/productos/:id`

Obtener un producto específico por ID.

**Parameters:**
- `id`: Product ID

**Response (200):**
```json
{
  "id": "product_id",
  "name": "Nombre del producto",
  "descripcion": "Descripción del producto",
  "imagen": "image_url",
  "estatus": true,
  "sizes": [
    {
      "size": "Mediana",
      "price": 25.99
    },
    {
      "size": "Grande",
      "price": 35.99
    }
  ],
  "category": "category_name"
}
```

**Error (404):**
```json
{
  "message": "Product not found"
}
```

---

#### 2.3 Create Product
**POST** `/productos`

Crear un nuevo producto.

**Request Body:**
```json
{
  "name": "Nombre del producto",
  "descripcion": "Descripción del producto (máx 200 caracteres)",
  "imagen": "image_url",
  "estatus": true,
  "sizes": [
    {
      "size": "Mediana",
      "price": 25.99
    },
    {
      "size": "Grande",
      "price": 35.99
    }
  ],
  "category": "category_name"
}
```

**Validación:**
- `name`: Mínimo 3 caracteres
- `descripcion`: Máximo 200 caracteres
- `imagen`: URL de imagen (opcional)
- `estatus`: Boolean (por defecto true)
- `sizes`: Array de tamaños con precio (mínimo 1), opciones: Chica, Mediana, Grande, Familiar, Mini, Por defecto
- `category`: Letras minúsculas y guiones bajos solamente (opcional)

**Response (201):**
```json
{
  "id": "new_product_id",
  "name": "Nombre del producto",
  "descripcion": "Descripción del producto",
  "imagen": "image_url",
  "estatus": true,
  "sizes": [
    {
      "size": "Mediana",
      "price": 25.99
    }
  ],
  "category": "category_name"
}
```

---

#### 2.4 Update Product
**PATCH** `/productos/:id`

Actualizar un producto existente.

**Parameters:**
- `id`: Product ID

**Request Body (todos los campos son opcionales):**
```json
{
  "name": "Nombre actualizado",
  "descripcion": "Descripción actualizada",
  "imagen": "new_image_url",
  "estatus": false,
  "sizes": [
    {
      "size": "Grande",
      "price": 40.99
    }
  ],
  "category": "new_category"
}
```

**Response (200):**
```json
{
  "id": "product_id",
  "name": "Nombre actualizado",
  "descripcion": "Descripción actualizada",
  "imagen": "new_image_url",
  "estatus": false,
  "sizes": [
    {
      "size": "Grande",
      "price": 40.99
    }
  ],
  "category": "new_category"
}
```

---

#### 2.5 Delete Product
**DELETE** `/productos/:id`

Eliminar un producto.

**Parameters:**
- `id`: Product ID

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

### 3. Orders Management

**Base URL:** `/pedidos`

*Requiere autenticación*

#### 3.1 Get All Orders
**GET** `/pedidos`

Obtener todos los pedidos. Soporta filtrado por fecha, estatus, cliente y paginación.

**Query Parameters (opcionales):**
- `fechaInicio`: Fecha de inicio (formato DD-MM-YYYY)
- `fechaFin`: Fecha de fin (formato DD-MM-YYYY)
- `estatus`: Estatus del pedido (TODO, DONE, CANCELED, DELETE)
- `cliente`: Nombre del cliente a buscar
- `pageSize`: Cantidad de resultados por página
- `cursorFechaCreacion`: Cursor para paginación

**Response (200):**
```json
{
  "pedidos": [
    {
      "id": "order_id",
      "cliente": "Nombre del cliente",
      "clienteLower": "nombre del cliente",
      "fechaEntrega": {
        "seconds": 1234567890,
        "nanoseconds": 123456789
      },
      "lugarEntrega": "Dirección de entrega",
      "productos": [
        {
          "id": "item_id",
          "cantidad": 2,
          "size": {
            "size": "Mediana",
            "price": 25.99
          },
          "producto": {
            "id": "product_id",
            "name": "Nombre del producto",
            "imagen": "image_url"
          },
          "caracteristicas": "característica especial",
          "subtotal": 51.98
        }
      ],
      "estatus": "TODO",
      "estatusPago": "PENDIENTE",
      "total": 51.98,
      "detalles": "Notas adicionales",
      "fechaCreacion": {
        "seconds": 1234567890,
        "nanoseconds": 123456789
      },
      "fechaActualizacion": {
        "seconds": 1234567890,
        "nanoseconds": 123456789
      },
      "registradoPor": "user@example.com",
      "actualizadoPor": "user@example.com"
    }
  ],
  "nextCursor": "cursor_value"
}
```

---

#### 3.2 Get Order by ID
**GET** `/pedidos/:id`

Obtener un pedido específico por ID.

**Parameters:**
- `id`: Order ID

**Response (200):**
```json
{
  "id": "order_id",
  "cliente": "Nombre del cliente",
  "clienteLower": "nombre del cliente",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Dirección de entrega",
  "productos": [
    {
      "id": "item_id",
      "cantidad": 2,
      "size": {
        "size": "Mediana",
        "price": 25.99
      },
      "producto": {
        "id": "product_id",
        "name": "Nombre del producto",
        "imagen": "image_url"
      },
      "caracteristicas": "característica especial",
      "subtotal": 51.98
    }
  ],
  "estatus": "TODO",
  "estatusPago": "PENDIENTE",
  "total": 51.98,
  "detalles": "Notas adicionales",
  "fechaCreacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "fechaActualizacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "registradoPor": "user@example.com",
  "actualizadoPor": "user@example.com"
}
```

---

#### 3.3 Get Orders Resume
**GET** `/pedidos/resume`

Obtener resumen de pedidos.

**Query Parameters (opcionales):**
- `fechaInicio`: Fecha de inicio (formato DD-MM-YYYY)
- `fechaFin`: Fecha de fin (formato DD-MM-YYYY)

**Response (200):**
```json
{
  "total": 100,
  "por_estatus": {
    "TODO": 30,
    "DONE": 60,
    "CANCELED": 5,
    "DELETE": 5
  },
  "total_monto": 5000.00,
  "monto_por_estatus": {
    "TODO": 1500.00,
    "DONE": 3000.00,
    "CANCELED": 400.00,
    "DELETE": 100.00
  }
}
```

---

#### 3.4 Create Order
**POST** `/pedidos`

Crear un nuevo pedido.

**Request Body:**
```json
{
  "cliente": "Nombre del cliente",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Dirección de entrega",
  "productos": [
    {
      "id": "item_id_unique",
      "cantidad": 2,
      "size": {
        "size": "Mediana",
        "price": 25.99
      },
      "producto": {
        "id": "product_id",
        "name": "Nombre del producto",
        "imagen": "image_url"
      },
      "caracteristicas": "característica especial",
      "subtotal": 51.98
    }
  ],
  "estatus": "TODO",
  "estatusPago": "PENDIENTE",
  "total": 51.98,
  "detalles": "Notas o instrucciones especiales"
}
```

**Validación:**
- `cliente`: Mínimo 5 caracteres
- `fechaEntrega`: Objeto Timestamp de Firebase con `seconds` (entero no negativo) y `nanoseconds` (0-999,999,999)
- `lugarEntrega`: String (opcional)
- `productos`: Array de productos (mínimo 1)
  - `id`: ID único del item
  - `cantidad`: Entero positivo
  - `size`: Objeto con `size` (string) y `price` (número positivo)
  - `producto`: Objeto con `id` (requerido), `name` (mínimo 3 caracteres) e `imagen` (opcional)
  - `caracteristicas`: String (opcional)
  - `subtotal`: Número positivo
- `estatus`: TODO, DONE, CANCELED o DELETE
- `estatusPago`: PENDIENTE, PAGADO o ABONADO
- `total`: Número positivo
- `detalles`: String (opcional)

**Response (200):**
```json
{
  "id": "new_order_id",
  "cliente": "Nombre del cliente",
  "clienteLower": "nombre del cliente",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Dirección de entrega",
  "productos": [...],
  "estatus": "TODO",
  "estatusPago": "PENDIENTE",
  "total": 51.98,
  "detalles": "Notas o instrucciones especiales",
  "fechaCreacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "fechaActualizacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "registradoPor": "user@example.com",
  "actualizadoPor": "user@example.com"
}
```

---

#### 3.5 Update Order
**PATCH** `/pedidos/:id`

Actualizar un pedido existente.

**Parameters:**
- `id`: Order ID

**Request Body (todos los campos son opcionales):**
```json
{
  "cliente": "Nombre actualizado",
  "lugarEntrega": "Nueva dirección",
  "productos": [
    {
      "id": "item_id",
      "cantidad": 3,
      "size": {
        "size": "Grande",
        "price": 35.99
      },
      "producto": {
        "id": "product_id",
        "name": "Nombre del producto",
        "imagen": "image_url"
      },
      "caracteristicas": "nueva característica",
      "subtotal": 107.97
    }
  ],
  "estatus": "DONE",
  "estatusPago": "PAGADO",
  "total": 107.97,
  "detalles": "Detalles actualizados"
}
```

**Response (200):**
```json
{
  "id": "order_id",
  "cliente": "Nombre actualizado",
  "clienteLower": "nombre actualizado",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Nueva dirección",
  "productos": [...],
  "estatus": "DONE",
  "estatusPago": "PAGADO",
  "total": 107.97,
  "detalles": "Detalles actualizados",
  "fechaCreacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "fechaActualizacion": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "registradoPor": "user@example.com",
  "actualizadoPor": "user@example.com"
}
```

---

### 4. Categories Management

**Base URL:** `/categories`

*Requiere autenticación*

#### 4.1 Get All Categories
**GET** `/categories`

Obtener todas las categorías.

**Response (200):**
```json
[
  {
    "id": "category_id",
    "descripcion": "nombre_categoria"
  }
]
```

---

#### 4.2 Create Category
**POST** `/categories`

Crear una nueva categoría.

**Request Body:**
```json
{
  "descripcion": "nombre_categoria"
}
```

**Validación:**
- `descripcion`: Letras minúsculas y guiones bajos (_) únicamente (máximo 200 caracteres)

**Response (201):**
```json
{
  "id": "new_category_id",
  "descripcion": "nombre_categoria"
}
```

---

#### 4.3 Delete Category
**DELETE** `/categories/:id`

Eliminar una categoría.

**Parameters:**
- `id`: Category ID

**Response (204):**
Sin contenido (No Content)

---

### 5. File Management

**Base URL:** `/files`

*Requiere autenticación*

#### 5.1 Upload Image
**POST** `/files`

Cargar una imagen a AWS S3.

**Content-Type:** `multipart/form-data`

**Request:**
- `file`: Archivo de imagen (multipart form)

**Response (201):**
```json
{
  "url": "https://s3.amazonaws.com/bucket/image-url",
  "key": "image-key"
}
```

---

### 6. Public Routes (Sin autenticación)

#### 6.1 Get Public Orders
**GET** `/public/pedidos`

Obtener pedidos públicos (sin autenticación requerida). Retorna versión sanitizada sin información sensible.

**Query Parameters (opcionales):**
- `fechaInicio`: Fecha de inicio (formato DD-MM-YYYY)
- `fechaFin`: Fecha de fin (formato DD-MM-YYYY)
- `estatus`: Estatus del pedido (TODO, DONE, CANCELED, DELETE)
- `cliente`: Nombre del cliente a buscar
- `pageSize`: Cantidad de resultados por página
- `cursorFechaCreacion`: Cursor para paginación

**Response (200):**
```json
{
  "pedidos": [
    {
      "id": "order_id",
      "cliente": "Nombre del cliente",
      "fechaEntrega": {
        "seconds": 1234567890,
        "nanoseconds": 123456789
      },
      "lugarEntrega": "Dirección de entrega"
    }
  ],
  "nextCursor": "cursor_value"
}
```

---

#### 6.2 Seed Database
**POST** `/seed`

Cargar datos iniciales en la base de datos (sin autenticación requerida).

**Request Body:**
```json
{}
```

**Response (200):**
```json
{
  "message": "Database seeded successfully",
  "productsCount": 10,
  "categoriesCount": 5
}
```

---

## Error Responses

### Códigos de Estado HTTP

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **204 No Content**: Operación exitosa sin contenido en respuesta (DELETE)
- **400 Bad Request**: Errores de validación o entrada inválida
- **401 Unauthorized**: Autenticación requerida o fallida
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

### Formato de Respuesta de Error
```json
{
  "message": "Descripción del error",
  "error": {
    "field": ["Error message"]
  }
}
```

### Errores Comunes

**Validación de Email**
```json
{
  "message": "Invalid email format"
}
```

**Password Débil**
```json
{
  "message": "Password must contain uppercase, lowercase, numbers and special characters"
}
```

**Credenciales Inválidas**
```json
{
  "message": "Invalid email or password"
}
```

**Recurso No Encontrado**
```json
{
  "message": "Product not found"
}
```

**Sin Autenticación**
```json
{
  "message": "Authentication required"
}
```

---

## Flujo de Autenticación

1. **Registrarse** en `/user/register`
2. **Iniciar sesión** en `/user/auth` para recibir cookies de autenticación
3. **Incluir cookies** automáticamente en solicitudes posteriores a endpoints protegidos
4. Las cookies son HTTP-only y se envían automáticamente por el navegador/cliente HTTP

## Ejemplos de Uso con cURL

### Registrarse
```bash
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3000/api/user/auth \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Obtener Productos (con autenticación)
```bash
curl -X GET http://localhost:3000/api/productos \
  -b cookies.txt
```

### Crear Producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Pastel de Chocolate",
    "descripcion": "Delicioso pastel casero",
    "imagen": "https://example.com/image.jpg",
    "estatus": true,
    "sizes": [
      {"size": "Mediana", "price": 25.99},
      {"size": "Grande", "price": 35.99}
    ],
    "category": "pasteles"
  }'
```

### Cargar Imagen
```bash
curl -X POST http://localhost:3000/api/files \
  -b cookies.txt \
  -F "file=@/path/to/image.jpg"
```

---

## Notas Importantes

- Las cookies de autenticación son HTTP-only por seguridad
- CORS está habilitado para solicitudes entre orígenes
- La API usa Firebase Firestore como base de datos
- Las imágenes se almacenan en AWS S3
- Todos los endpoints devuelven respuestas en JSON
- El servidor corre en el puerto 3000 por defecto
- Las timestamps de Firebase usan formato de objetos con `seconds` y `nanoseconds`
- Los tamaños disponibles son: Chica, Mediana, Grande, Familiar, Mini, Por defecto
- Los estatus de pedido son: TODO, DONE, CANCELED, DELETE
- Los estatus de pago son: PENDIENTE, PAGADO, ABONADO
- La paginación se implementa con cursores para mejor rendimiento
- Los campos de búsqueda en pedidos son case-insensitive (se usa `clienteLower`) 