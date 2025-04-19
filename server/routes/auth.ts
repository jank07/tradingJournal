import { RouterContext } from "oak";
import { getUserByEmail, createUser } from "../db.ts";
import { hash } from "bcrypt";
import { generateToken } from "./tokenAuth.ts";

export async function register(ctx: RouterContext<"/register">) {
  const { email, password } = await ctx.request.body({ type: "json" }).value;

  const headers = { "Content-Type": "application/json" };

  //  Basic validation for email and password
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid email" };
    return;
  }

  if (!password || password.length < 6) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Password must be at least 6 characters" };
    return;
  }

  // Check if user exists 
  // const exists = await users.findOne({ email });
  // if (exists) {
  //   ctx.response.status = 409;
  //   ctx.response.body = { error: "User already exists" };
  //   return;
  // }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    ctx.response.status = 400;
    ctx.response.body = { message: "User already exists" };
    return;
  }

  // Hash password and insert user into database
  const passwordHash = await hash(password);
  const newUser = await createUser({ email, passwordHash });


  
  // const insertId = await users.insertOne({
  //   email,
  //   passwordHash,
  //   createdAt: new Date(),
  // });

    // Return success response
  ctx.response.status = 201;
  ctx.response.body = { 
    message: "User registered", 
    userId: newUser._id.$oid, 
  };
}