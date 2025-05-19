import { verifyToken } from '../routes/tokenAuth.ts'; // Funkcja weryfikacji tokenu
import { RouterContext } from 'https://deno.land/x/oak/mod.ts';

// Middleware for authenticating JWT tokens
export async function authMiddleware(ctx: RouterContext, next: Function) {
  const authorization = ctx.request.headers.get('Authorization');

  if (!authorization) {
    ctx.response.status = 401;
    ctx.response.body = { message: 'Authorization header missing' };
    return;
  }

  // Check if the token is in the correct format (Bearer token)
  const token = authorization.split(' ')[1];

  try {
    const decoded = await verifyToken(token); // Try to verify the token
    ctx.state.user = decoded; // Store the decoded token in the context state
    await next();
  } catch (error) {
    ctx.response.status = 401;
    ctx.response.body = { message: 'Invalid token' };
  }
}
