import {
  createEmployeeService,
  deleteEmployeeService,
  employeeByIdService,
  getAllEmployeesService,
  loginAuthenticate,
  updateEmployeeService,
} from "../models/employeeModel.js";
import { handleResponse } from "../utils/handleResponse.js";
import dotenv from "dotenv";
import verifyToken from "../utils/verifyToken.js";


dotenv.config();

const validateToken = (req, res, next) => {
  const isTokenValid = verifyToken(req, res, next);
  if (!isTokenValid) handleResponse(res, 403, "Invalid or Unauthorized token.");
}

export const createEmployee = async (req, res, next) => {
  validateToken(req, res, next);
  try {

    const { name, email, designation, salary, password, confirm_password } = req.body;

    const newEmployee = await createEmployeeService(
      name,
      email,
      designation,
      salary,
      password,
      confirm_password
    );
    handleResponse(res, 201, "Employee created successfully", newEmployee);
  } catch (error) {
    next(error);
  }
};

export const getAllEmployees = async (req, res, next) => {
  validateToken(req, res, next);
  try {
    const employees = await getAllEmployeesService();
    handleResponse(res, 200, "Employees fetched successfully", employees);
  } catch (error) {
    next(error);
  }
};

export const getEmployeeById = async (req, res, next) => {
  validateToken(req, res, next);

  try {
    const employee = await employeeByIdService(req.params.id);
    if (!employee) return handleResponse(res, 404, "Employee not found");
    handleResponse(res, 200, "Employee fetched successfully", employee);
  } catch (error) {
    next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  validateToken(req, res, next);

  try {
    const { name, email, designation, salary } = req.body;
    const updatedEmployee = await updateEmployeeService(
      req.params.id,
      name,
      email,
      designation,
      salary
    );
    if (!updatedEmployee) return handleResponse(res, 404, "Employee not found");
    handleResponse(res, 200, "Employee updated successfully", updatedEmployee);
  } catch (error) {
    next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  validateToken(req, res, next);

  try {
    const deletedEmployee = await deleteEmployeeService(req.params.id);
    if (!deletedEmployee) return handleResponse(res, 404, "Employee not found");
    handleResponse(res, 200, "Employee deleted successfully", deletedEmployee);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if admin user exists
    const adminUser = await loginAuthenticate(res, email, password);

    if (!adminUser) return handleResponse(res, 403, "Invalid login credentials");
    handleResponse(res, 200, "Employee fetched successfully", adminUser);

  } catch (error) {
    next(error);
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
    httpOnly: true,
    secure: false, 
    sameSite: 'lax',
  });

  handleResponse(res, 200, "Logged out successfully", {});

  } catch (error) {
    next(error);
  }
}
