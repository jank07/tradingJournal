import * as jwt from "https://deno.land/x/djwt@v2.4/mod.ts";
import { config } from "dotenv";

const env = config();

// Load environment variables from .env file
const SECRET_KEY = (env["JWT_SECRET"]);

// Check if JWT_SECRET is set in .env file
if (!SECRET_KEY) {
    throw new Error("JWT_SECRET not set in .env");
  }


export function generateToken(userId: string) {
  const payload = {
    sub: userId, // subject (user ID)
    iat: Date.now(), // time of issue
  };

  // Create JWT token with HS256 algorithm
  const token = jwt.create({ alg: "HS256", typ: "JWT" }, payload, SECRET_KEY);

  return token;
}


export async function verifyToken(token: string) {
    try {
      return await jwt.verify(token, SECRET_KEY);
    } catch (err) {
      throw new Error("Invalid token");
    }
  }