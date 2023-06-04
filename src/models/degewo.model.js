import mongoose, { Schema } from "mongoose";
import { timestamp } from "rxjs";

const degewoSchema = new Schema(
  {
    title: { type: String, required: true },
    meta: { type: String, required: true },
    link: String,
    sended: Boolean,
    sendedAt: Date,
    sendedTo: Array,
    sendedToCount: Number,
    blacklist: Boolean,
    blacklistAt: Date,
    lastEdited: Date,
  },
  { timestamp: true }
);

// create model
const DegewoModel = mongoose.model("Degewo", degewoSchema);

export { DegewoModel };
