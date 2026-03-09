# Sweet Moments API

Una API RESTful desarrollada en Node.js con TypeScript para la gestión de productos, pedidos, categorías e imágenes de Sweet Moments.

## Características

- **Lenguaje**: TypeScript con Express 5
- **Autenticación**: Firebase Auth con cookies HTTP-only
- **Base de Datos**: Firebase Firestore
- **Almacenamiento**: AWS S3 para imágenes
- **Validación**: Esquemas con Zod
- **CORS**: Configurado para desarrollo y producción
- **Testing**: Jest + Supertest

## Requisitos Previos

- Node.js 18 o superior
- Cuenta de Firebase con Firestore habilitado
- Cuenta de AWS con un bucket S3
- Variables de entorno configuradas

## Instalación

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

Crea los archivos `.env.development` y `.env.production` en la raíz del proyecto:

```env
# Firebase Client SDK
APIKEY=your_firebase_api_key
AUTHDOMAIN=your_project.firebaseapp.com
DATABASEURL=https://your_project.firebaseio.com
PROJECTID=your_project_id
STORAGEBUCKET=your_project.appspot.com
MESSAGINGSENDERID=your_sender_id
APPID=your_app_id

# Firebase Admin SDK
PRIVATEKEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CLIENTEMAIL=your_service_account@your_project.iam.gserviceaccount.com

# AWS S3
AWSACCESSKEYID=your_access_key_id
AWSSECRETACCESSKEY=your_secret_access_key
AWSREGION=us-east-2
AWSBUCKETNAME=your_bucket_name

# Servidor
PORT=3000
NODE_ENV=development
```

4. **Ejecuta el servidor**
```bash
npm run dev      # Desarrollo
npm start        # Producción (requiere build previo)
```

El servidor estará disponible en `http://localhost:3000`

## Scripts Disponibles

```bash
npm run dev      # Modo desarrollo con recarga automática (tsx + nodemon)
npm run build    # Compila TypeScript a dist/
npm start        # Producción desde dist/server.js
npm test         # Ejecuta los tests con Jest
```

## Estructura del Proyecto

```
sm-node/
├── src/
│   ├── server.ts            # Punto de entrada, inicializa Firebase
│   ├── app.ts               # Configuración de Express y rutas
│   ├── controllers/         # Lógica de negocio
│   ├── routes/              # Definición de rutas
│   ├── models/
│   │   ├── firebase/        # Modelos de Firestore (Product, Pedido, User, Category)
│   │   └── aws/             # Modelo de archivos S3
│   ├── middlewares/         # CORS, autenticación, multer
│   ├── schemas/             # Esquemas de validación Zod
│   ├── types/               # Tipos TypeScript
│   ├── data/                # Datos estáticos para seed
│   └── utils/               # Utilidades y constantes
├── app.js                   # Wrapper para Vercel
├── vercel.json              # Configuración de Vercel
├── Dockerfile               # Configuración de Docker
├── tsconfig.json            # Configuración de TypeScript
├── jest.config.ts           # Configuración de Jest
└── package.json
```

## Endpoints de la API

### Autenticación

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/user/register` | No | Registrar nuevo usuario |
| POST | `/api/user/auth` | No | Iniciar sesión |

### Productos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/productos` | Si | Obtener todos los productos |
| GET | `/api/productos/:id` | Si | Obtener producto por ID |
| POST | `/api/productos` | Si | Crear nuevo producto |
| PATCH | `/api/productos/:id` | Si | Actualizar producto |
| DELETE | `/api/productos/:id` | Si | Eliminar producto |

### Categorías

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/categories` | Si | Obtener todas las categorías |
| POST | `/api/categories` | Si | Crear nueva categoría |

### Pedidos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/pedidos` | Si | Obtener todos los pedidos (paginado) |
| GET | `/api/pedidos/resume` | Si | Resumen de pedidos |
| GET | `/api/pedidos/:id` | Si | Obtener pedido por ID |
| POST | `/api/pedidos` | Si | Crear nuevo pedido |
| PATCH | `/api/pedidos/:id` | Si | Actualizar pedido |
| GET | `/api/public/pedidos` | No | Vista pública de pedidos |

### Archivos

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/files` | Si | Subir imagen a AWS S3 |

### Utilidades

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| POST | `/api/seed` | No | Poblar base de datos con datos iniciales |

## Autenticación

La API usa Firebase Auth. El flujo es:

1. El usuario se registra o inicia sesión
2. Se genera un token que se almacena en una cookie HTTP-only
3. Las rutas protegidas verifican la cookie en cada petición

```javascript
// Login
const response = await fetch('/api/user/auth', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!'
  })
});
// Las peticiones siguientes incluyen la cookie automáticamente
```

## Base de Datos

Firebase Firestore con las siguientes colecciones:

- `users` - Información de usuarios
- `products` - Catálogo de productos
- `categories` - Categorías de productos
- `pedidos` - Pedidos de clientes

## Almacenamiento de Archivos

Las imágenes se suben directamente a AWS S3 usando `multer-s3`. El endpoint `/api/files` recibe archivos multipart y retorna la URL pública del archivo subido.

## Paginación

Los endpoints de listas soportan paginación por cursor:

```
GET /api/pedidos?pageSize=10&cursorFechaCreacion=2024-01-01T00:00:00.000Z
```

## Estados de Pedidos

- `BACKLOG` - Pendiente de procesar
- `INCOMPLETE` - Incompleto
- `DONE` - Completado
- `CANCELED` - Cancelado
- `DELETE` - Eliminado

## Estados de Pago

- `PENDIENTE` - Pago pendiente
- `PAGADO` - Pago realizado

## Configuración de CORS

Los orígenes permitidos están en `src/middlewares/cors.ts`:

- `https://sweetmoments.mx`
- `https://www.sweetmoments.mx`
- `https://services.sweetmoments.mx`
- `https://www.services.sweetmoments.mx`
- `http://localhost:5173`
- `http://localhost:8081`
- `*.vercel.app`

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests específicos
npm test -- --testNamePattern="Catalogs sizes"
```

## Despliegue

### Vercel

```bash
npm i -g vercel
vercel
```

### Docker

```bash
docker build -t sweet-moments-api .
docker run -p 3000:3000 sweet-moments-api
```

## Licencia

Este proyecto está bajo la Licencia MIT.
