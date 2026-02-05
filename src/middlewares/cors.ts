import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'https://sweetmoments.mx',
  'https://www.sweetmoments.mx',
  'https://services.sweetmoments.mx',
  'https://www.services.sweetmoments.mx',
  'http://localhost:5173',
];

// acepta *.vercel.app
const VERCEL_REGEX = /^https:\/\/.*\.vercel\.app$/;

export const corsMiddleware = () =>
  cors({
    origin: (origin, callback) => {
      // requests internas (postman, server-to-server, etc)
      if (!origin) return callback(null, true);

      if (
        ACCEPTED_ORIGINS.includes(origin) ||
        VERCEL_REGEX.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
