import { Application, Router } from "oak";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { config } from "dotenv";
import { register } from "./routes/auth.ts";
import { login } from "./routes/login.ts";
import { authMiddleware } from "./middlewares/authJWT.ts";
import "./db.ts";

// Load environment variables from .env file
const env = config();

// Initialize MongoDB connection and collections
const app = new Application();
const router = new Router();


// Middleware to handle CORS
router.post("/register", register);
router.post("/login", login);

// Middleware to handle CORS
app.use(oakCors());

// Securing the /protected route with JWT authentication
router.get("/protected", authMiddleware, (ctx) => {
    ctx.response.body = { message: "Protected data", user: ctx.state.user };
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });