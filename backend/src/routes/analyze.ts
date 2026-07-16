import { Router } from "express";
import { analyzeController } from "../controllers/analyzeController";

const router = Router();

router.post("/analyze", analyzeController);

export default router;
