import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry.js';

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title: 'Sweet Moments API',
      version: '1.0.0',
      description:
        'API RESTful para la gestión de productos, pedidos, categorías e imágenes de Sweet Moments.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Desarrollo' },
      { url: 'https://services.sweetmoments.mx', description: 'Producción' },
    ],
  });
}
