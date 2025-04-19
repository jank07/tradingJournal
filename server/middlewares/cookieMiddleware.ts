import { Middleware } from "oak";
import { verify } from "djwt";
import { SECRET_KEY } from "../config.ts";

export const authMiddleware: Middleware = async (ctx, next) => {
  const token = await ctx.cookies.get("token");

  if (!token) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Brak tokena" };
    return;
  }

  try {
    const payload = await verify(token, SECRET_KEY, "HS512");
    ctx.state.user = payload;
    await next();
  } catch (_) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Token nieprawidłowy lub wygasł" };
  }
};