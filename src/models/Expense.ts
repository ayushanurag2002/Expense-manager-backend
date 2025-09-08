// src/models/Expense.ts
import { Schema, model } from "mongoose";

const expenseSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true }, // debit/credit/unknown
    amount: { type: Number, required: true },
    description: { type: String },              // free text, e.g. SMS body
    date: { type: Date, required: true },       // timestamp from SMS

    // 🆕 Recommended fields for UPI/SMS tracking
    sender: { type: String },                   // e.g. "VM-HDFCBK-S"
    senderReceiver: { type: String },           // person/merchant
    upiTransactionId: { type: String },         // UPI ref / txn id
    rawMessage: { type: String },               // full SMS for reference
  },
  { timestamps: true }
);

// 🛡️ Prevent duplicate entries per user per transaction timestamp
expenseSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Expense = model("Expense", expenseSchema);
