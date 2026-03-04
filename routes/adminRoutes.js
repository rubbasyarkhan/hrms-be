import express from "express";
import * as adminController from "../controllers/adminController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", adminController.login);
router.post("/logout", adminController.logout);

// Protected routes
router.get("/profile", auth, adminController.getAdminProfile);
router.get("/verify", auth, adminController.verifyAuth);

export default router;
