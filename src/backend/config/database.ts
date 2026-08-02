import mongoose from "mongoose";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

const DEFAULT_URI = "mongodb+srv://nikhilyadavug23_db_user:qG7srxXnllYNMero@databaseroom.4bkn1qr.mongodb.net/databaseroom?retryWrites=true&w=majority";

const DATABASE_URL = process.env.DATABASE_CONNECTION_STRING || DEFAULT_URI;

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(DATABASE_URL, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 15000,
        family: 4
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;