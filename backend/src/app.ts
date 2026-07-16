import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
