import { Router } from "express";
import multer from "multer";
import { analyzeArchiveController, analyzeController } from "../controllers/analyzeController";

const router = Router();
const MAX_ARCHIVE_BYTES = 50 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_ARCHIVE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    callback(null, file.originalname.toLowerCase().endsWith(".zip"));
  },
});

router.post("/analyze", analyzeController);
router.post("/analyze/archive", upload.single("archive"), analyzeArchiveController);

export default router;
