import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";

dotenv.config();

export const getAllEmployeesService = async () => {
  const result = await pool.query(
    "select id, name, email, designation, salary, password from employees"
  );
  return result.rows;
};

export const employeeByIdService = async (id) => {
  const result = await pool.query(
    "select id, name, email, designation, salary from employees where id = $1",
    [id]
  );
  return result.rows[0];
};

export const createEmployeeService = async (
  name,
  email,
  designation,
  salary,
  password
) => {
  let hashedPassword = null;

  if (password) {
    const saltRounds = process.env.BCRYPT_SALT;
    hashedPassword = await bcrypt.hash(password, saltRounds);
  }

  const result = await pool.query(
    "INSERT INTO employees (name, email, designation, salary, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, designation, salary",
    [name, email, designation, salary, hashedPassword]
  );
  return result.rows[0];
};

export const updateEmployeeService = async (
  id,
  name,
  email,
  designation,
  salary
) => {
  const result = await pool.query(
    "UPDATE employees set name=$1, email=$2, designation=$3, salary=$4 WHERE id=$5 RETURNING  id, name, email, designation, salary",
    [name, email, designation, salary, id]
  );
  return result.rows[0];
};

export const deleteEmployeeService = async (id) => {
  const result = await pool.query(
    "DELETE from employees WHERE id = $1 RETURNING id, name, email, designation, salary",
    [id]
  );
  return result.rows[0];
};

export const loginAuthenticate = async (email, password) => {
  const result = await pool.query(
    "select id,name, designation, email, password from employees where email = $1",
    [email]
  );

  try {
    const match = await bcrypt.compare(
      String(password),
      result.rows[0]?.password
    );
    if (match) {
      result.rows[0].token = generateToken(result.rows[0].id);
      delete result.rows[0].password;
      return result.rows[0];
    } 
  } catch (error) {
    return false;
  }

};
