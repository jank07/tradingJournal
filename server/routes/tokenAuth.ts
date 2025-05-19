import {
  create,
  getNumericDate,
  Header,
  verify,
} from 'https://deno.land/x/djwt@v3.0.2/mod.ts';
import { config } from 'https://deno.land/x/dotenv/mod.ts';

const env = config();

// Load environment variables from .env file
const SECRET_KEY = env['JWT_SECRET'];

// Check if JWT_SECRET is set in .env file
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET not set in .env');
}

const header: Header = {
  alg: 'HS512',
  typ: 'JWT',
};

const keyPromise = await crypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(SECRET_KEY),
  { name: 'HMAC', hash: 'SHA-512' },
  false,
  ['sign', 'verify']
);

export async function generateToken(
  payload: Record<string, unknown>
): Promise<string> {
  const key = await keyPromise; // Await the key initialization
  const jwtPayload = {
    ...payload,
    exp: getNumericDate(60 * 60), // Token expiration time (1 hour)
  };
  const token = await create(header, jwtPayload, key);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const key = await keyPromise;
    return await verify(token, key);
  } catch (err) {
    throw new Error('Invalid token');
  }
}
