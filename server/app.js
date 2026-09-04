import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import healthRoutes from "./routes/health.js";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import animalRoutes from "./routes/animals.js";
import shelterRoutes from "./routes/shelters.js";
import adoptionRoutes from "./routes/adoptions.js";
import consentRoutes from "./routes/consent.js";
import surveyRoutes from "./routes/surveys.js";

const app = express();

app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "100kb" }));

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

app.use("/api", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/animals", animalRoutes);
app.use("/api/shelters", shelterRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/consent", consentRoutes);
app.use("/api/surveys", surveyRoutes);

if (process.env.NODE_ENV !== "production") {
  app.get("/api/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
