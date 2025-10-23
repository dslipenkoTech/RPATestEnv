import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Route imports
import routes from "./routes/sessions";
import bugThresholdRoutes from "./routes/bug-threshold";
import sessionsInfoRoutes from "./routes/sessions-analytics";
import testRoutes from "./routes/tests";

// Service imports
import { sessionRecoveryService } from "./services/session-recovery";
import { ErrorHandler } from "./middleware/error-handler";

const app = express();
dotenv.config();

// Middleware configuration
app.use(cors({ origin: [process.env.FRONTEND_URL as string], credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use("/api/sessions", routes);
app.use("/api/bug-threshold", bugThresholdRoutes);
app.use("/api/sessions-info", sessionsInfoRoutes);
app.use("/api/tests", testRoutes);

// Health check endpoint
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// 404 handler
app.use(ErrorHandler.handleNotFound);

// Error handling middleware
app.use(ErrorHandler.handleError);

// For local development
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`\x1b[32mServer running on port ${PORT}\x1b[0m`);

  // Resume any active sessions that were interrupted by server restart
  // This runs asynchronously and doesn't block the server startup
  sessionRecoveryService.resumeActiveSessions().catch((error) => {
    console.error("Failed to resume active sessions on startup:", error);
  });
});

export default app;
