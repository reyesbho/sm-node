# API Documentation - Sweet Moments

## Base URL
```
http://localhost:3000/api
```

## Descripción General
API RESTful desarrollada con Node.js, Express y TypeScript para gestionar productos, pedidos, categorías, usuarios e imágenes de Sweet Moments.

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

Obtener todos los productos.

**Response (200):**
```json
[
  {
    "id": "product_id",
    "descripcion": "Descripción del producto",
    "imagen": "image_url",
    "estatus": true
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
  "descripcion": "Descripción del producto",
  "imagen": "image_url",
  "estatus": true
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
  "descripcion": "Descripción del producto",
  "imagen": "image_url",
  "estatus": true
}
```

**Response (201):**
```json
{
  "id": "new_product_id",
  "descripcion": "Descripción del producto",
  "imagen": "image_url",
  "estatus": true
}
```

---

#### 2.4 Update Product
**PATCH** `/productos/:id`

Actualizar un producto existente.

**Parameters:**
- `id`: Product ID

**Request Body:**
```json
{
  "descripcion": "Descripción actualizada",
  "imagen": "new_image_url",
  "estatus": false
}
```

**Response (200):**
```json
{
  "id": "product_id",
  "descripcion": "Descripción actualizada",
  "imagen": "new_image_url",
  "estatus": false
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

Obtener todos los pedidos.

**Response (200):**
```json
[
  {
    "id": "order_id",
    "cliente": "Nombre del cliente",
    "fechaEntrega": "2026-02-04",
    "lugarEntrega": "Dirección de entrega",
    "productos": [
      {
        "producto": "ID o nombre del producto",
        "cantidad": 2,
        "precio": 25.99,
        "tamaño": "M",
        "caracteristicas": ["feature1", "feature2"]
      }
    ]
  }
]
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
  "fechaEntrega": "2026-02-04",
  "lugarEntrega": "Dirección de entrega",
  "productos": [...]
}
```

---

#### 3.3 Get Orders Resume
**GET** `/pedidos/resume`

Obtener resumen de pedidos.

**Response (200):**
```json
{
  "total": 10,
  "pendientes": 5,
  "completados": 5
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
  "fechaEntrega": "2026-02-04",
  "lugarEntrega": "Dirección de entrega",
  "productos": [
    {
      "producto": "product_id",
      "cantidad": 2,
      "precio": 25.99,
      "tamaño": "M",
      "caracteristicas": ["feature1"]
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "new_order_id",
  "cliente": "Nombre del cliente",
  "fechaEntrega": "2026-02-04",
  "lugarEntrega": "Dirección de entrega",
  "productos": [...]
}
```

---

#### 3.5 Update Order
**PATCH** `/pedidos/:id`

Actualizar un pedido existente.

**Parameters:**
- `id`: Order ID

**Request Body:**
```json
{
  "cliente": "Nombre actualizado",
  "lugarEntrega": "Nueva dirección",
  "productos": [...]
}
```

**Response (200):**
```json
{
  "id": "order_id",
  "cliente": "Nombre actualizado",
  "lugarEntrega": "Nueva dirección",
  "productos": [...]
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
    "nombre": "Nombre de la categoría",
    "descripcion": "Descripción",
    "estatus": true
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
  "nombre": "Nombre de la categoría",
  "descripcion": "Descripción",
  "estatus": true
}
```

**Response (201):**
```json
{
  "id": "new_category_id",
  "nombre": "Nombre de la categoría",
  "descripcion": "Descripción",
  "estatus": true
}
```

---

#### 4.3 Delete Category
**DELETE** `/categories/:id`

Eliminar una categoría.

**Parameters:**
- `id`: Category ID

**Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

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

Obtener pedidos públicos (sin autenticación requerida).

**Response (200):**
```json
[
  {
    "id": "order_id",
    "cliente": "Nombre del cliente",
    "fechaEntrega": "2026-02-04",
    "productos": [...]
  }
]
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

### Códigos de Error Comunes

- **400 Bad Request**: Errores de validación o entrada inválida
- **401 Unauthorized**: Autenticación requerida o fallida
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

### Formato de Respuesta de Error
```json
{
  "message": "Descripción del error"
}
```

---

## Flujo de Autenticación

1. **Registrarse** en `/user/register`
2. **Iniciar sesión** en `/user/auth` para recibir cookies de autenticación
3. **Incluir cookies** en solicitudes posteriores a endpoints protegidos
4. **Cerrar sesión** si es necesario

---

## Notas Importantes

- Las cookies de autenticación son HTTP-only por seguridad
- CORS está habilitado para solicitudes entre orígenes
- La API usa Firebase Firestore como base de datos
- Las imágenes se almacenan en AWS S3
- Todos los endpoints devuelven respuestas en JSON
- El servidor corre en el puerto 3000 por defecto
- La documentación se basa en la versión actual del proyecto 