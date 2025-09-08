// src/controllers/expense.controller.ts
import { Request, Response } from "express";
import { Expense } from "../models/Expense";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

// ✅ Create expense
export const createExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.create({
      category: req.body.category,
      amount: req.body.amount,
      description: req.body.description,
      userId: req.user.id, // from JWT
    });
    res.status(201).json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get all expenses for logged-in user
export const getUserExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getMonthlyExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Aggregate monthly expenses
    const monthly = await Expense.aggregate([
      {
        $match: { userId, category: "debit" },
      },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalAmount: { $sum: "$amount" },
          transactions: { $push: "$$ROOT" },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
    ]);

    // Transform _id to "Month Year" string
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const formatted = monthly.map((item) => {
      const { year, month } = item._id;
      return {
        month: `${monthNames[month - 1]} ${year}`,
        totalAmount: item.totalAmount,
        transactions: item.transactions,
      };
    });

    res.json(formatted);
  } catch (err: any) {
    console.error("Monthly aggregation error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const syncExpenses = async (req: AuthRequest, res: Response) => {
  try {
    const { transactions } = req.body;

    if (!transactions || !Array.isArray(transactions)) {
      return res.status(400).json({ message: "Transactions array is required" });
    }

    const userId = req.user.id;

    // Normalize timestamps to numbers for comparison
    const timestamps = transactions
      .map((txn: any) => new Date(txn.timestamp).getTime())
      .filter((t: number) => !isNaN(t));

    // Find existing ones with same userId + timestamp
    const existingExpenses = await Expense.find({
      userId,
      date: { $in: timestamps.map((t) => new Date(t)) },
    });

    const existingTimestamps = new Set(
      existingExpenses.map((e) => e.date.getTime())
    );

    // Split new vs already entered
    const newTransactions = transactions.filter(
      (txn: any) => !existingTimestamps.has(new Date(txn.timestamp).getTime())
    );

    const alreadyEntered = transactions.filter((txn: any) =>
      existingTimestamps.has(new Date(txn.timestamp).getTime())
    );

    // Prepare docs for insertion
    const expensesToInsert = newTransactions.map((txn: any) => ({
      category: txn.transactionType || "unknown",
      amount: txn.amount,
      description: txn.rawMessage || txn.sender,
      userId,
      date: new Date(txn.timestamp),
      upiTransactionId: txn.upiTransactionId || null,
      senderReceiver: txn.senderReceiver || "Unknown",
      sender: txn.sender,
    }));

    let inserted: any[] = [];
    if (expensesToInsert.length > 0) {
      inserted = await Expense.insertMany(expensesToInsert);
    }

    return res.status(201).json({
      success: true,
      message: `${inserted.length} new transactions saved. ${alreadyEntered.length} already existed.`,
      saved: inserted,
      alreadyEntered,
    });
  } catch (err: any) {
    console.error("Sync error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while syncing messages",
    });
  }
};



// ✅ Get single expense by ID
export const getExpenseById = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update expense
export const updateExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete expense
export const deleteExpense = async (req: AuthRequest, res: Response) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Server error" });
  }
};
