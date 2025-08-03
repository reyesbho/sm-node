# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication. After login, the server sets HTTP-only cookies with access and refresh tokens. Include these cookies in subsequent requests.

## Endpoints

### User Management

#### 1. User Registration
**POST** `/user/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 8 characters, must contain uppercase, lowercase, numbers, and special characters

**Response:**
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

#### 2. User Login
**POST** `/user/login`

Authenticate user and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "token": "access_token_string"
}
```

**Cookies Set:**
- `access_token`: HTTP-only cookie (1 hour expiration)
- `refresh_token`: HTTP-only cookie (12 hours expiration)

**Error Response (401):**
```json
{
  "message": "Authentication failed"
}
```

---

#### 3. User Logout
**POST** `/user/logout`

Logout user and clear authentication cookies.

**Response:**
```json
{
  "message": "Succefull logout"
}
```

**Error Response (401):**
```json
{
  "message": "Error al deslogearse"
}
```

---

### Products Management

**Base URL:** `/api/products`

*All product endpoints require authentication*

#### 1. Get All Products
**GET** `/api/products`

Retrieve all products.

**Response:**
```json
[
  {
    "id": "product_id",
    "descripcion": "Product description",
    "imagen": "image_url",
    "estatus": true,
    "tag": "product_tag"
  }
]
```

---

#### 2. Get Product by ID
**GET** `/api/products/:id`

Retrieve a specific product by ID.

**Parameters:**
- `id`: Product ID

**Response:**
```json
{
  "id": "product_id",
  "descripcion": "Product description",
  "imagen": "image_url",
  "estatus": true,
  "tag": "product_tag"
}
```

---

#### 3. Create Product
**POST** `/api/products`

Create a new product.

**Request Body:**
```json
{
  "descripcion": "Product description",
  "imagen": "image_url",
  "estatus": true,
  "tag": "product_tag"
}
```

**Validation Rules:**
- `descripcion`: Minimum 3 characters
- `imagen`: Optional string
- `estatus`: Boolean (default: true)
- `tag`: Optional, maximum 20 characters, lowercase letters only, no spaces or numbers

**Response:**
```json
{
  "id": "new_product_id",
  "descripcion": "Product description",
  "imagen": "image_url",
  "estatus": true,
  "tag": "product_tag"
}
```

---

#### 4. Update Product
**PATCH** `/api/products/:id`

Update an existing product.

**Parameters:**
- `id`: Product ID

**Request Body:**
```json
{
  "descripcion": "Updated description",
  "imagen": "new_image_url",
  "estatus": false,
  "tag": "new_tag"
}
```

**Response:**
```json
{
  "id": "product_id",
  "descripcion": "Updated description",
  "imagen": "new_image_url",
  "estatus": false,
  "tag": "new_tag"
}
```

---

#### 5. Update Product State
**PUT** `/api/products/:id`

Update product status.

**Parameters:**
- `id`: Product ID

**Request Body:**
```json
{
  "estatus": false
}
```

**Response:**
```json
{
  "id": "product_id",
  "estatus": false
}
```

---

#### 6. Delete Product
**DELETE** `/api/products/:id`

Delete a product.

**Parameters:**
- `id`: Product ID

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

---

### Size Products Management

**Base URL:** `/api/sizes`

*All size product endpoints require authentication*

#### 1. Get All Size Products
**GET** `/api/sizes`

Retrieve all size products.

**Response:**
```json
[
  {
    "id": "size_id",
    "descripcion": "Size description",
    "estatus": true,
    "tags": ["tag1", "tag2"]
  }
]
```

---

#### 2. Get Size Product by ID
**GET** `/api/sizes/:id`

Retrieve a specific size product by ID.

**Parameters:**
- `id`: Size Product ID

**Response:**
```json
{
  "id": "size_id",
  "descripcion": "Size description",
  "estatus": true,
  "tags": ["tag1", "tag2"]
}
```

---

#### 3. Create Size Product
**POST** `/api/sizes`

Create a new size product.

**Request Body:**
```json
{
  "descripcion": "Size description",
  "estatus": true,
  "tags": ["tag1", "tag2"]
}
```

**Validation Rules:**
- `descripcion`: Minimum 3 characters
- `estatus`: Boolean (default: true)
- `tags`: Optional array of strings

**Response:**
```json
{
  "id": "new_size_id",
  "descripcion": "Size description",
  "estatus": true,
  "tags": ["tag1", "tag2"]
}
```

---

#### 4. Update Size Product
**PATCH** `/api/sizes/:id`

Update an existing size product.

**Parameters:**
- `id`: Size Product ID

**Request Body:**
```json
{
  "descripcion": "Updated size description",
  "estatus": false,
  "tags": ["new_tag1", "new_tag2"]
}
```

**Response:**
```json
{
  "id": "size_id",
  "descripcion": "Updated size description",
  "estatus": false,
  "tags": ["new_tag1", "new_tag2"]
}
```

---

#### 5. Update Size Product State
**PUT** `/api/sizes/:id`

Update size product status.

**Parameters:**
- `id`: Size Product ID

**Request Body:**
```json
{
  "estatus": false
}
```

**Response:**
```json
{
  "id": "size_id",
  "estatus": false
}
```

---

### Orders Management

**Base URL:** `/api/pedidos`

*All order endpoints require authentication*

#### 1. Get All Orders
**GET** `/api/pedidos`

Retrieve all orders.

**Response:**
```json
[
  {
    "id": "order_id",
    "fechaEntrega": {
      "seconds": 1234567890,
      "nanoseconds": 123456789
    },
    "lugarEntrega": "Delivery address",
    "cliente": "Customer name",
    "productos": [
      {
        "cantidad": 2,
        "size": {
          "id": "size_id",
          "descripcion": "Size description"
        },
        "producto": {
          "id": "product_id",
          "descripcion": "Product description",
          "imagen": "image_url"
        },
        "caracteristicas": ["feature1", "feature2"],
        "precio": 29.99
      }
    ]
  }
]
```

---

#### 2. Get Order by ID
**GET** `/api/pedidos/:id`

Retrieve a specific order by ID.

**Parameters:**
- `id`: Order ID

**Response:**
```json
{
  "id": "order_id",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Delivery address",
  "cliente": "Customer name",
  "productos": [
    {
      "cantidad": 2,
      "size": {
        "id": "size_id",
        "descripcion": "Size description"
      },
      "producto": {
        "id": "product_id",
        "descripcion": "Product description",
        "imagen": "image_url"
      },
      "caracteristicas": ["feature1", "feature2"],
      "precio": 29.99
    }
  ]
}
```

---

#### 3. Create Order
**POST** `/api/pedidos`

Create a new order.

**Request Body:**
```json
{
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Delivery address",
  "cliente": "Customer name",
  "productos": [
    {
      "cantidad": 2,
      "size": {
        "id": "size_id",
        "descripcion": "Size description"
      },
      "producto": {
        "id": "product_id",
        "descripcion": "Product description",
        "imagen": "image_url"
      },
      "caracteristicas": ["feature1", "feature2"],
      "precio": 29.99
    }
  ]
}
```

**Validation Rules:**
- `fechaEntrega`: Timestamp object with seconds (non-negative integer) and nanoseconds (0-999,999,999)
- `lugarEntrega`: Optional string
- `cliente`: Minimum 5 characters
- `productos`: Optional array of product objects
  - `cantidad`: Positive integer
  - `size`: Object with id (required) and descripcion (min 3 chars)
  - `producto`: Object with id (required) and descripcion (min 3 chars), imagen optional
  - `caracteristicas`: Optional array of strings
  - `precio`: Positive number (default: 0)

**Response:**
```json
{
  "id": "new_order_id",
  "fechaEntrega": {
    "seconds": 1234567890,
    "nanoseconds": 123456789
  },
  "lugarEntrega": "Delivery address",
  "cliente": "Customer name",
  "productos": [...]
}
```

---

#### 4. Update Order
**PATCH** `/api/pedidos/:id`

Update an existing order.

**Parameters:**
- `id`: Order ID

**Request Body:**
```json
{
  "lugarEntrega": "Updated delivery address",
  "cliente": "Updated customer name",
  "productos": [...]
}
```

**Response:**
```json
{
  "id": "order_id",
  "fechaEntrega": {...},
  "lugarEntrega": "Updated delivery address",
  "cliente": "Updated customer name",
  "productos": [...]
}
```

---

## Error Responses

### Common Error Codes

- **400 Bad Request**: Validation errors or invalid input
- **401 Unauthorized**: Authentication required or failed
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "message": "Error description"
}
```

## Authentication Flow

1. **Register** a new user account using `/user/register`
2. **Login** using `/user/login` to receive authentication cookies
3. **Include cookies** in subsequent requests to protected endpoints
4. **Logout** using `/user/logout` to clear authentication

## Notes

- All timestamps use Firebase Timestamp format with `seconds` and `nanoseconds`
- Authentication cookies are HTTP-only for security
- CORS is enabled for cross-origin requests
- The API uses Firebase Firestore as the database backend
- All endpoints return JSON responses 