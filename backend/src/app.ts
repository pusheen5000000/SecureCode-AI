import express from "express";
import cors from "cors";
import multer from "multer";
import analyzeRoutes from "./routes/analyze";
import chatRoutes from "./routes/chat";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api", analyzeRoutes);
app.use("/api", chatRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "ZIP files must not exceed 50 MB." });
    }
    return res.status(400).json({ error: err.message });
  }

  console.error("Unhandled request error:", err);
  return res.status(500).json({ error: "Unexpected server error" });
});

export default app;
