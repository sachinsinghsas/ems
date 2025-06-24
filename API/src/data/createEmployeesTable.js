import pool from "../config/db.js";

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
        pool.query(queryText);
        console.log("Employees table created if not exists");
    } catch (error) {
        console.log("Error creating employees table: ", error);
    }
}

export default createEmployeesTable;