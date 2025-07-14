import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import employeeRoutes from "./routes/employeeRoutes.js"
import errorHandling from "./middlewares/errorHandler.js";
import createEmployeesTable from "./data/createEmployeesTable.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: 'json' };


dotenv.config();

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const port = process.env.PORT;

//Middlewares
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: 'http://localhost:5173',  
  credentials: true             
}

app.use(cors(corsOptions));

//Create table before starting server
 createEmployeesTable();

//Routes
app.use("/api", employeeRoutes);

//Error handling middleware
app.use(errorHandling)

export default app;

