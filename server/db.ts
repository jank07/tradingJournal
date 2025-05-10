import {
    Bson,
    MongoClient,
  } from "https://deno.land/x/mongo@v0.32.0/mod.ts";
import { config } from "dotenv";

const env = config();
const mongoURI = (env["MONGO_URI"]);

if (!mongoURI) {
    throw new Error("MONGO_URI is not set in the .env file");
  }

console.log("Connecting to MongoDB with URI:", mongoURI);

const client = new MongoClient();
const connectToMongoDB = async () => {
    try {
      console.log("Connecting to MongoDB...");
      await client.connect(
        mongoURI,
      );
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
      console.log("Successfully connected to MongoDB");
      return client.database(env["MONGO_DB_NAME"]);
    } catch (err) {
      console.error("Error connecting to MongoDB:", err);
      throw err;
    }
  };


const dbConnection = await connectToMongoDB();
const db = client.database(env["MONGO_DB_NAME"]);
export const users = db.collection<User>("users");
export const tradesCollection = db.collection<User>("trades");

export interface User {
  _id?: { $oid: string };
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export async function getUserByEmail(email: string) {
  return await users.findOne({ email });
}

export async function createUser(user: User) {
  const insertId = await users.insertOne(user);
  return { _id: insertId, ...user };
}