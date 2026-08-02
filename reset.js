import mongoose from "mongoose";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

const mongoUri = "mongodb://nikhilyadavug23_db_user:qG7srxXnllYNMero@ac-sb8kyk8-shard-00-00.4bkn1qr.mongodb.net:27017,ac-sb8kyk8-shard-00-01.4bkn1qr.mongodb.net:27017,ac-sb8kyk8-shard-00-02.4bkn1qr.mongodb.net:27017/databaseroom?ssl=true&replicaSet=atlas-q6c42h-shard-0&authSource=admin&retryWrites=true&w=majority";

async function resetAllPlaces() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db;

  // Clear existing establishments so seed will re-seed fresh places at exact 100 score & 4.0 rating
  const result = await db.collection("establishments").deleteMany({});
  console.log("Cleared establishments count:", result.deletedCount);

  await mongoose.disconnect();
}

resetAllPlaces().catch(console.error);
