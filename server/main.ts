import { serve } from "https://deno.land/std/http/server.ts";
import { registerUser } from "./controllers/auth.ts";

const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

serve(async (req) => {
    const url = new URL(req.url);
    if (req.method === "OPTIONS") return new Response(null, { headers });
  
    if (req.method === "POST" && url.pathname === "/api/register") {
      const res = await registerUser(req);
      headers.forEach((v, k) => res.headers.set(k, v));
      return res;
    }
  
    return new Response("Not Found", { status: 404, headers });
}, { port: 8000 });