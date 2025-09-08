import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import testRoutes from "./routes/testRoutes";
import errorHandler from "./middleware/errorMiddleware";

import userRoutes from "./routes/user.routes";
import expenseRoutes from "./routes/expese.routes";

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/test", testRoutes);
app.use("/api/v1/users", userRoutes);      // handles User creation
app.use("/api/v1/expenses", expenseRoutes); // handles Expense creation

// Error Handler
app.use(errorHandler);

export default app;
