import {
    Bson,
    MongoClient,
  } from "https://deno.land/x/mongo@v0.34.0/mod.ts";
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
    //   "mongodb+srv://admin:admin@cluster0.snaxmvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0&authMechanism=SCRAM-SHA-1"
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
export const users = db.collection("users");