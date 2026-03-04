import express from "express";
import * as jobController from "../controllers/jobController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.post("/", jobController.createJob);
router.get("/", jobController.getJobs);
router.get("/stats", jobController.getJobStats);
router.get("/:id", jobController.getJobById);
router.put("/:id", jobController.updateJob);
router.put("/:id/close", jobController.closeJob);
router.delete("/:id", jobController.deleteJob);

export default router;
