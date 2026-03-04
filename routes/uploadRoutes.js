import express from "express";
import * as uploadController from "../controllers/uploadController.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import imageUpload from "../middleware/imageUpload.js";

const router = express.Router();

router.post(
  "/resume",
  upload.single("resume"),
  auth,
  uploadController.uploadResume,
);

router.post(
  "/job-image",
  imageUpload.single("profilePicture"),
  auth,
  uploadController.uploadJobImage,
);

export default router;
