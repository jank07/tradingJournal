import { RouterContext } from "oak";
import { tradesCollection } from "../db.ts";

export async function addTrade(ctx: RouterContext) {
  const user = ctx.state.user;
  if (!user) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const { symbol, rr, date, result } = await ctx.request.body({ type: "json" }).value;

  if (!symbol || !rr || !date || !result) {
    ctx.response.status = 400;
    ctx.response.body = { message: "Missing required fields" };
    return;
  }

  const trade = {
    userEmail: user.email,
    symbol,
    rr,
    date,
    result,
    createdAt: new Date(),
  };

  const inserted = await tradesCollection.insertOne(trade);

  ctx.response.status = 201;
  ctx.response.body = { message: "Trade saved", tradeId: inserted };
}
