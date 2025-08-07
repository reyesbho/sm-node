# Sweet Moments API

Una API RESTful desarrollada en Node.js para la gestión de productos, pedidos y usuarios de Sweet Moments.

## 🚀 Características

- **Autenticación**: Sistema de autenticación con Firebase Auth
- **Base de Datos**: Firebase Firestore como base de datos
- **Validación**: Esquemas de validación con Zod
- **CORS**: Configuración de CORS para desarrollo y producción
- **Cookies**: Autenticación mediante cookies HTTP-only seguras
- **Paginación**: Sistema de paginación para consultas grandes

## 📋 Requisitos Previos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Firebase con Firestore habilitado
- Variables de entorno configuradas

## 🛠️ Instalación

1. **Clona el repositorio**
```bash
git clone <repository-url>
cd sm-node
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Firebase Config
APIKEY=your_firebase_api_key
AUTHDOMAIN=your_project.firebaseapp.com
DATABASEURL=https://your_project.firebaseio.com
PROJECTID=your_project_id
STORAGEBUCKET=your_project.appspot.com
MESSAGINGSENDERID=your_sender_id
APPID=your_app_id

# Firebase Admin SDK
TYPE=service_account
PROJECT_ID=your_project_id
PRIVATE_KEY_ID=your_private_key_id
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLIENT_EMAIL=your_service_account_email
CLIENT_ID=your_client_id
AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your_service_account_email
UNIVERSE_DOMAIN=googleapis.com

# Server Config
PORT=3000
NODE_ENV=development
```

4. **Ejecuta el servidor**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Endpoints de la API

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/user/register` | Registrar nuevo usuario |
| POST | `/user/login` | Iniciar sesión |
| POST | `/user/logout` | Cerrar sesión |

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener producto por ID |
| POST | `/api/products` | Crear nuevo producto |
| PATCH | `/api/products/:id` | Actualizar producto |
| PUT | `/api/products/:id` | Actualizar estado del producto |
| DELETE | `/api/products/:id` | Eliminar producto |

### Tamaños

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/sizes` | Obtener todos los tamaños |
| GET | `/api/sizes/:id` | Obtener tamaño por ID |
| POST | `/api/sizes` | Crear nuevo tamaño |
| PATCH | `/api/sizes/:id` | Actualizar tamaño |
| PUT | `/api/sizes/:id` | Actualizar estado del tamaño |

### Pedidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/pedidos` | Obtener todos los pedidos |
| GET | `/api/pedidos/:id` | Obtener pedido por ID |
| POST | `/api/pedidos` | Crear nuevo pedido |
| PATCH | `/api/pedidos/:id` | Actualizar pedido |

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Ejecutar en modo desarrollo
npm start           # Ejecutar en modo producción

# Testing
npm test            # Ejecutar tests
npm run test:watch  # Ejecutar tests en modo watch

# Build
npm run build       # Compilar el proyecto
```

## 🏗️ Estructura del Proyecto

```
sm-node/
├── src/
│   ├── controllers/     # Controladores de la API
│   ├── data/           # Datos estáticos
│   ├── middlewares/    # Middlewares personalizados
│   ├── models/         # Modelos de datos
│   │   └── firebase/   # Modelos específicos de Firebase
│   ├── routes/         # Definición de rutas
│   ├── schemas/        # Esquemas de validación
│   ├── test/           # Tests unitarios
│   └── utils/          # Utilidades y constantes
├── app.js              # Configuración de Express
├── server.js           # Punto de entrada del servidor
├── package.json        # Dependencias y scripts
└── README.md          # Documentación
```

## 🔐 Autenticación

La API utiliza Firebase Auth para la autenticación. El flujo es el siguiente:

1. **Registro**: El usuario se registra con email y contraseña
2. **Login**: Se autentica y recibe tokens de acceso
3. **Cookies**: Los tokens se almacenan en cookies HTTP-only
4. **Protección**: Los endpoints protegidos verifican la autenticación

### Ejemplo de uso:

```javascript
// Login
const response = await fetch('/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});

// Las cookies se establecen automáticamente
// Las siguientes peticiones incluirán la autenticación
```

## 🗄️ Base de Datos

El proyecto utiliza Firebase Firestore como base de datos. Las colecciones principales son:

- `users`: Información de usuarios
- `products`: Catálogo de productos
- `sizes`: Tamaños disponibles
- `pedidos`: Pedidos de clientes

## 🧪 Testing

Los tests están escritos con Jest y Supertest:

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test -- --testNamePattern="Catalogs sizes"

# Ejecutar tests en modo watch
npm run test:watch
```

## 🚀 Despliegue

### Vercel

El proyecto incluye configuración para Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Docker

```bash
# Construir imagen
docker build -t sweet-moments-api .

# Ejecutar contenedor
docker run -p 3000:3000 sweet-moments-api
```

## 🔧 Configuración de CORS

Los orígenes permitidos están configurados en `src/middlewares/cors.js`:

- `https://sweetmoments.mx`
- `https://www.sweetmoments.mx`
- `https://services.sweetmoments.mx`
- `https://www.services.sweetmoments.mx`
- `http://localhost:5173`
- `http://localhost:8081`

## 📝 Validación de Datos

La API utiliza Zod para la validación de esquemas:

- **Usuarios**: Email válido, contraseña segura
- **Productos**: Descripción mínima, tags específicos
- **Tamaños**: Descripción mínima, tags opcionales
- **Pedidos**: Estructura compleja con productos y fechas

## 🔄 Estados de Pedidos

Los pedidos pueden tener los siguientes estados:

- `BACKLOG`: Pendiente de procesar
- `INCOMPLETE`: Incompleto
- `DONE`: Completado
- `CANCELED`: Cancelado
- `DELETE`: Eliminado

## 💳 Estados de Pago

- `PENDIENTE`: Pago pendiente
- `PAGADO`: Pago realizado

## 📊 Paginación

Los endpoints que devuelven listas grandes soportan paginación:

```javascript
// Ejemplo de paginación en pedidos
GET /api/pedidos?pageSize=10&cursorFechaCreacion=2024-01-01T00:00:00.000Z
```


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
