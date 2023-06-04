// mongodb
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DegewoModel } from "./../../models/index.js";

dotenv.config();

let db = null;

export async function connectToDatabase() {
  try {
    if (db) return Promise.resolve("Database already connected");

    const databaseUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PW}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}`;

    mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });

    db = mongoose.connection;

    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
      console.log("Database connected");
      return Promise.resolve("Database connected");
    });
  } catch (error) {
    mongoose.disconnect();
    console.log(`database ERROR: `, error);
  }
}

export function degewoDBAdd(data) {
  const degewo = new DegewoModel(data);

  degewo
    .save()
    .then(() => {
      console.log("saved to database");
    })
    .catch((err) => {
      console.log("error saving to database", err);
    });
}
