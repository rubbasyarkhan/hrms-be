import express from "express";
import * as departmentController from "../controllers/departmentController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.post("/", departmentController.createDepartment);
router.get("/", departmentController.getDepartments);
router.get("/stats", departmentController.getDepartmentStats);
router.get("/:id", departmentController.getDepartmentById);
router.put("/:id", departmentController.updateDepartment);
router.delete("/:id", departmentController.deleteDepartment);

export default router;
