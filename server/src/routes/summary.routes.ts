import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addDialogue,
  enableSummary,
  generateSummaryFile,
} from "../controllers/summary.controller";
import { generateSummary } from "../middlewares/generateSummary";

const router = Router();

router.route("/add-dialogue").patch(addDialogue);
<<<<<<< HEAD
// router.use(verifyJWT);

router.route("/enable-summary/:roomId").patch(enableSummary);

router.route("/summary-file").patch(generateSummary, generateSummaryFile);
=======
router.use(verifyJWT);

router.route("/enable-summary/:roomId").patch(enableSummary);
router
  .route("/summary-file/:roomId")
  .patch(generateSummary, generateSummaryFile);

>>>>>>> bd67bda5c7573aa0a023d7b3e7505aa5dbdcb611
export default router;
