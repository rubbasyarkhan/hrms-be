import express from "express";
import * as organizationController from "../controllers/organizationController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth);

router.post("/", organizationController.createOrganization);
router.get("/", organizationController.getOrganizations);
router.get("/stats", organizationController.getOrganizationStats);
router.get("/:id", organizationController.getOrganizationById);
router.put("/:id", organizationController.updateOrganization);
router.delete("/:id", organizationController.deleteOrganization);

export default router;
