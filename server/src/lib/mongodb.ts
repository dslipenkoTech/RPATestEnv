import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

const mongoDB_URI = process.env.MONGODB_URI as string;
if (!mongoDB_URI) throw new Error("MONGODB_URI is not defined in the env variables");

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opt = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };
    console.log(`
--
🔄 Connecting to MongoDB...
--
      `);
    cached.promise = mongoose.connect(mongoDB_URI, opt);
  }

  try {
    await cached.promise;
    cached.conn = mongoose.connection;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
