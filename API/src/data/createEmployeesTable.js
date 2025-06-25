import bcrypt from "bcryptjs";
import pool from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const createEmployeesTable = async () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    designation VARCHAR(100) NOT NULL,
    salary VARCHAR(100) NOT NULL,
    password TEXT NULL,
    created_at TIMESTAMP DEFAULT NOW()
) 
    `;

    try {
        await pool.query(queryText);
        console.log('Table created')

        const result = await pool.query(
            "select id, name, email, designation, salary from employees where id = $1",
            [1]
        );

        if (result.rows[0] === undefined) {
            const saltRounds = 10; // This is the cost factor, not the salt itself
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds);

            const queryTextInsert = "INSERT INTO employees (name, email, designation, salary, password) VALUES ($1, $2, $3, $4, $5) RETURNING id";
            const values = ['John Doe',process.env.ADMIN_EMAIL, 'admin', '2000', hashedPassword];
            await pool.query(queryTextInsert, values);
            console.log('Admin user created')
        }

    }
    catch (error) {
        console.log('Issue while generating table', error)
    }
}

export default createEmployeesTable;