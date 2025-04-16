import db from "../db.ts";
import { hashSync } from "../deps.ts";
import { User } from "../models/User.ts";

const users = db.collection<User>("users");

export async function registerUser(req: Request): Promise<Response> {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });

  try {
    const { email, password } = await req.json();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // email validation, does it contain @, no space, and does it have something before . and after.

    if (!emailRegex.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format" }), {
        status: 400,
        headers,
    });
    }

    // password validation, 6 char.
    
    if (password.length < 6) {
        return new Response(JSON.stringify({ error: "Password must be at least 6 characters" }), {
          status: 400,
          headers,
        });
      }

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing data" }), { status: 400, headers });
    }

    const existing = await users.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "User exists" }), { status: 409, headers });
    }

    const passwordHash = hashSync(password, 10);
    const newUser: User = {
      email,
      passwordHash,
      createdAt: new Date(),
    };

    const insert = await users.insertOne(newUser);
    return new Response(JSON.stringify({ message: "Registered", userId: insert.$oid }), {
      status: 201,
      headers,
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers });
  }
}