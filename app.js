import cookieParser from "cookie-parser";
import express from "express";
import { PORT } from "./config/env.js";
import connectToDatabase from "./database/mongodb.js";
import arcjetMiddleware from "./middlewares/arject.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";
import userRoutes from "./routes/user.routes.js";
import workflowRouter from "./routes/workflow.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(errorMiddleware);
// app.use(arcjetMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/workflows", workflowRouter);

app.listen(PORT, async () => {
  console.log(`Subscription Tracker is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
