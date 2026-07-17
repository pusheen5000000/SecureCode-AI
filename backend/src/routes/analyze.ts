import { Router } from "express";
import multer from "multer";
import { analyzeArchiveController, analyzeController } from "../controllers/analyzeController";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.originalname.toLowerCase().endsWith(".zip"));
  },
});

router.post("/analyze", analyzeController);
router.post("/analyze/archive", upload.single("archive"), analyzeArchiveController);

export default router;
