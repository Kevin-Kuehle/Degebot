// mongodb
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DegewoModel } from "./../../models/index.js";

dotenv.config();

let adminDB = null;

export async function initConnection(databaseName) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`devlog: init Database`);
      // create connection url
      const databaseUrl = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PW}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}?authSource=admin`;

      // connect as admin
      adminDB = mongoose.createConnection(databaseUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
      });

      adminDB.on("error", (error) => {
        console.log(`Database error: `, error);
        mongoose.disconnect();
      });

      adminDB.on("connected", () => {
        console.log(`Database connected`);
        return resolve();
      });
    } catch (error) {
      mongoose.disconnect();
      reject(error);
    }
  });
}

// export function createCollection(databaseName, model, data) {}

export async function createDatabase(databaseName) {
  console.log(`devlog: createDatabase: ${databaseName}`);

  await adminDB.db.admin().command({ create: databaseName });
}

export async function databaseExist(databaseName) {
  try {
    const Admin = mongoose.mongo.Admin;
    let databases = await new Admin(adminDB.db).listDatabases();
    const exist = databases.databases.some((db) => db.name === databaseName);
    return Promise.resolve(exist);
  } catch (error) {
    throw new Error(error);
  }
}

export async function createCollection(database, model, data) {
  try {
    const db = await adminDB.useDb(database);
    const collection = db.model(model.modelName, model.schema);
    await collection.insertMany(data);
  } catch (error) {
    throw new Error(error);
  }
}

export async function addData(database, data) {
  try {
    // use connection pool from adminDB
    const db = adminDB.useDb(database);
    const model = db.model("dingdong", new mongoose.Schema({ name: String }));
    model.create({ name: "audi" });
  } catch (error) {
    console.log(`devlog: error`, error);
  }
}
