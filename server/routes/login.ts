import { RouterContext } from "https://deno.land/x/oak/mod.ts";
import { generateToken } from "./tokenAuth.ts";
import { getUserByEmail } from "../db.ts";  
import { compare } from "bcrypt";

export async function login(ctx: RouterContext) {
  const { email, password } = await ctx.request.body().value;


  const user = await getUserByEmail(email);

  if (!user || !(await compare(password, user.passwordHash))) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Invalid credentials" };
    return;
  }

  const payload = {
    email: user.email,

  }
  const token = await generateToken( payload );
  

  ctx.response.status = 200;
  ctx.response.body = { token };
}