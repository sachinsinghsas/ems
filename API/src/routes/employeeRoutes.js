import express from "express";

import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  login,
  logout,
  updateEmployee,
} from "../controllers/employeeController.js";
import validateEmployee from "../middlewares/inputValidator.js";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.post("/employee", validateEmployee, createEmployee);
router.put("/employee/:id", validateEmployee,  updateEmployee);
router.delete("/employee/:id", deleteEmployee);
router.post("/login", login);
router.post("/logout", logout);


export default router;
