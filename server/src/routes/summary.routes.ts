import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addDialogue,
  generateSummaryFile,
} from "../controllers/summary.controller";
import { generateSummary } from "../middlewares/generateSummary";

const router = Router();

router.use(verifyJWT);

router.route("/add-dialogue").patch(addDialogue);
router.route("/summary-file").patch(generateSummary, generateSummaryFile);

export default router;
