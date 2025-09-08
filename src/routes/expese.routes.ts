// src/routes/expense.routes.ts
import { Router } from "express";
import authMiddleware from "../middleware/authMiddleware";
import {
  createExpense,
  getUserExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  syncExpenses,
  getMonthlyExpenses
} from "../controllers/expense.controller";

const router = Router();

router.post("/", authMiddleware, createExpense);
router.get("/", authMiddleware, getUserExpenses);  
router.get("/monthly", authMiddleware, getMonthlyExpenses);    
router.get("/:id", authMiddleware, getExpenseById);    
router.put("/:id", authMiddleware, updateExpense);   
router.delete("/:id", authMiddleware, deleteExpense);
router.post("/sync", authMiddleware, syncExpenses);


export default router;
