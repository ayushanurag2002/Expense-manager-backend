// src/routes/user.routes.ts
import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser);       // POST /api/v1/users (signup)
router.post("/login", loginUser);   // POST /api/v1/users/login

export default router;
