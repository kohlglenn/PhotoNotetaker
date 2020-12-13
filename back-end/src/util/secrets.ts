import dotenv from 'dotenv';

dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = prod
  ? process.env['MONGODB_URI']
  : process.env['MONGODB_URI_LOCAL'];
