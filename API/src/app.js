import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import pool from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js"
import errorHandling from "./middlewares/errorHandler.js";
import createEmployeesTable from "./data/createEmployeesTable.js";

dotenv.config();

const app = express();

const port = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cors());

//Create table before starting server
createEmployeesTable();

//Routes
app.use("/api", employeeRoutes);

//Error handling middleware
app.use(errorHandling)


//Server
app.listen(port, () => {
    console.log("Server is running on port:", port)
})

