import mongoose, { Schema } from "mongoose";

const botSchemaMeta = new Schema({
  name: { type: String, required: true },
  version: { type: String, required: false },
  created: { type: Date, required: true, default: Date.now },
  updated: { type: Date, required: true, default: Date.now },
  runs: { type: Number, required: false, default: 0 },
  lastRun: { type: Date, required: false, default: null },
  lastRunDuration: { type: Number, required: false, default: null },
  lastRunError: { type: String, required: false, default: null },
  lastRunErrorAt: { type: Date, required: false, default: null },
  lastRunErrorCount: { type: Number, required: false, default: 0 },
  lastRunErrorCountMax: { type: Number, required: false, default: 5 },
});

const botSchemaConfig = new Schema(
  {
    compareAttributes: { type: Array, required: true },
    searchRegex: { type: String, required: true },
  },
  { timestamp: true }
);

const botSchemaBlacklist = new Schema(
  {
    value: { type: String, required: true },
  },
  { timestamp: true }
);

const BotMetaModel = mongoose.model("meta", botSchemaMeta);
const BotBlacklistModel = mongoose.model("blacklist", botSchemaBlacklist);
const BotConfigModel = mongoose.model("config", botSchemaConfig);

export { BotMetaModel, BotBlacklistModel, BotConfigModel };
