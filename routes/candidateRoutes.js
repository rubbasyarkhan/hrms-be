import express from "express";
import * as candidateController from "../controllers/candidateController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.post("/", candidateController.createCandidate);
router.get("/", candidateController.getCandidates);
router.get("/stats", candidateController.getCandidateStats);
router.get("/:id", candidateController.getCandidateById);
router.put("/:id", candidateController.updateCandidate);
router.delete("/:id", candidateController.deleteCandidate);

export default router;
