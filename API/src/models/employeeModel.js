import pool from "../config/db.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import generateToken from "../utils/generateToken.js";

dotenv.config();

export const getAllEmployeesService = async () => {
  const result = await pool.query(
    "select id, name, email, designation, salary from employees ORDER BY name"
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
  password,
  confirm_password
) => {

  const saltRounds = Number(process.env.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

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

export const loginAuthenticate = async (res, email, password) => {
  const result = await pool.query(
    "select id,name, designation, email, password from employees where email = $1",
    [email]
  );

  //If employee's email id doe not exist in database
  if (typeof result.rows[0] === 'undefined') {
    return false;
  }


  //if email id exists then check the password
  const match = await bcrypt.compare(
    String(password),
    result.rows[0]?.password
  );

  //If password is correct then generate the token
  if (match) {
    result.rows[0].token = generateToken(result.rows[0].id);

    res.cookie('token', result.rows[0].token, {
      httpOnly: true,
      secure: false,    //set true in production
      maxAge: 3600000
    });

    //removed password from response
    delete result.rows[0].password;
    return result.rows[0];

  }

  return false;
};
