import express from "express";
import * as employeeController from "../controllers/employeeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.use(auth); // Protect all routes

router.post("/", employeeController.createEmployee);
router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployeeById);
router.put("/:id", employeeController.updateEmployee);
router.delete("/:id", employeeController.deleteEmployee);

export default router;
