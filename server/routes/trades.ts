import { tradesCollection } from "../db.ts";
import { RouterContext } from "oak";
import { Bson } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

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

export const getTrades = async (ctx: RouterContext) => {
  const user = ctx.state.user;
  if (!user?.email) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized" };
    return;
  }

  const trades = await tradesCollection.find({ userEmail: user.email }).toArray();
  ctx.response.body = trades;
};

export const deleteTrade = async (ctx: RouterContext) => {
  const user = ctx.state.user;
  const { id } = ctx.params;

  if (!user || !id) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized or Missing ID" };
    return;
  }

  const deleted = await tradesCollection.deleteOne({
    _id: new Bson.ObjectId(id),
    userEmail: user.email,
  });

  if (deleted === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Trade not found" };
  } else {
    ctx.response.status = 200;
    ctx.response.body = { message: "Trade deleted" };
  }
};

export const editTrade = async (ctx: RouterContext) => {
  const user = ctx.state.user;
  const { id } = ctx.params;

  console.log("Received PUT request for trade ID:", id);  // Log the ID

  if (!user || !id) {
    ctx.response.status = 401;
    ctx.response.body = { message: "Unauthorized or Missing ID" };
    return;
  }

  const { symbol, rr, date, result } = await ctx.request.body({ type: "json" }).value;

  let objectId: Bson.ObjectId;
  try {
  objectId = new Bson.ObjectId(id); // This must succeed
} catch {
  ctx.response.status = 400;
  ctx.response.body = { message: "Invalid trade ID format" };
  return;
}

const updated = await tradesCollection.updateOne(
  { _id: objectId, userEmail: user.email },
  { $set: { symbol, rr, date, result } }
);

  if (updated.modifiedCount === 0) {
    ctx.response.status = 404;
    ctx.response.body = { message: "Trade not found or not modified" };
  } else {
    ctx.response.status = 200;
    ctx.response.body = { message: "Trade updated" };
  }
};
