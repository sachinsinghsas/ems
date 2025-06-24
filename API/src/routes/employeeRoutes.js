import express from "express";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  login,
  updateEmployee,
} from "../controllers/employeeController.js";
import validateEmployee from "../middlewares/inputValidator.js";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.get("/employees/:id", getEmployeeById);
router.post("/employees", validateEmployee, createEmployee);
router.put("/employees/:id", validateEmployee,  updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.post("/login", login);

export default router;
