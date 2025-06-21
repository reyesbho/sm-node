//crate your own required products
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
export const readJSON = (filePath) => require(filePath);