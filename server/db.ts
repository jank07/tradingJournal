import { MongoClient } from "./deps.ts";
import "https://deno.land/std@0.224.0/dotenv/load.ts";

const uri = Deno.env.get("MONGO_URI");
const dbName = Deno.env.get("MONGO_DB_NAME");

if (!uri || !dbName) {
  throw new Error("Missing MONGO_URI or MONGO_DB_NAME in .env");
}

const client = new MongoClient();
await client.connect(uri);

const db = client.database(dbName);
export default db;