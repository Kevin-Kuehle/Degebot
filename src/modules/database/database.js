// mongodb
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let db = null;

export async function connectToDatabase(databaseName) {
  try {
    // connect to mongodb

    const databaseUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PW}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`;
    console.log(`devlog: try to connect to database: ${databaseUrl}`);

    if (db) return Promise.resolve();
    mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });

    db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Database connected");
      return Promise.resolve();
    });
  } catch (error) {
    // disconnect from mongodb
    mongoose.disconnect();
    console.log(`database ERROR: `, error);
  }
}

export function addToDatabase(databaseName, data) {
  const collection = db.collection(databaseName);
  collection.insertOne(data);
}
