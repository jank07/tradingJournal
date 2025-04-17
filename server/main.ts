import { Application, Router } from "oak";
import { config } from "dotenv";
import { register } from "./routes/auth.ts";
import "./db.ts";

// Load environment variables from .env file
const env = config();

// Initialize MongoDB connection and collections
const app = new Application();
const router = new Router();


// Middleware to handle CORS
router.post("/register", register);


app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });