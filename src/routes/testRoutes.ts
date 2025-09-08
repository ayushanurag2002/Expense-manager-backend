import { Router } from "express";
import { testAPI } from "../controllers/testController";

const router = Router();

router.get("/", testAPI);

export default router;
