import { Application, Router } from "oak";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { config } from "dotenv";
import { register } from "./routes/auth.ts";
import { login } from "./routes/login.ts";
import { authMiddleware } from "./middlewares/authJWT.ts";
import "./db.ts";

// Load environment variables from .env file
const env = config();
const app = new Application();
// Middleware to handle CORS
app.use(
  oakCors({
    origin: "http://localhost:5173", // exact origin of frontend
    credentials: true,               // allow cookies to be sent
  }),
);

// Initialize MongoDB connection and collections
const router = new Router();

router.post("/register", register);
router.post("/login", login);


// Securing the /protected route with JWT authentication
router.get("/protected", authMiddleware, (ctx) => {
    ctx.response.body = { message: "Protected data", user: ctx.state.user };
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });