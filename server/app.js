import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import { requestLogger } from "./middleware/logger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./controllers/auth.js";
import animalRoutes from "./routes/animals.js";
import shelterRoutes from "./routes/shelters.js";
import adoptionRoutes from "./routes/adoptions.js";
import consentRoutes from "./routes/consent.js";
import surveyRoutes from "./routes/surveys.js";

const app = express();

// --- Security ---
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: { message: "Too many requests, please try again later", statusCode: 429 } },
  })
);

// --- Body Parsing & Logging ---
app.use(express.json({ limit: "100kb" }));
app.use(requestLogger);

// --- Swagger UI (disabled in production) ---
if (process.env.NODE_ENV !== "production") {
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Animal Shelters API — Swagger",
    })
  );
}

// --- API Routes ---
app.use("/api", healthRoutes);
app.use("/api", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/surveys", surveyRoutes);

// --- OpenAPI JSON (only in non-production) ---
if (process.env.NODE_ENV !== "production") {
  app.get("/api/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

// --- 404 & Error Handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
