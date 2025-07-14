import { jest } from '@jest/globals';
import request from 'supertest';
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import { logout } from '../controllers/employeeController.js';

dotenv.config();


//create employee mock data
const mock_create = {
    "status": 201,
    "message": "Employee created successfully",
    "data": {
        "id": 30,
        "name": "Test",
        "email": "tester@gmail.com",
        "designation": "Supervisor",
        "salary": "1000"
    }
};

const mockCreateEmployee = jest.fn((req, res) => {
  return res.status(201).json(mock_create);
});


//fetch employees mock data
const mock_fetch_employees = {
    "status": 204,
    "message": "Employees fetched successfully",
    "data": [
        {
            "id": 1,
            "name": "Random mock",
            "email": "dsadasdd@gmail.com",
            "designation": "Manager",
            "salary": "1000"
        }
    ]
};

const mockGetAllEmployees = jest.fn((req, res) => {
  return res.status(200).json(mock_fetch_employees);
});



jest.unstable_mockModule('../controllers/employeeController.js', () => ({
  createEmployee: mockCreateEmployee,
  getAllEmployees: mockGetAllEmployees,
  getEmployeeById: jest.fn(),
  updateEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
}));

const appModule = await import('../app.js');
const app = appModule.default;



describe('GET /api/employees', () => {
  it('returns mocked employees list', async () => {
    
    const res = await request(app)
      .get('/api/employees');
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mock_fetch_employees);
    expect(mockGetAllEmployees).toHaveBeenCalled();
  });

    it('returns mocked created employee', async () => {

      const res = await request(app)
      .post('/api/employee');
      
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(mock_create);
    expect(mockGetAllEmployees).toHaveBeenCalled();
  });

    it('returns employees list', async () => {
    
    const res = await request(app)
      .get('/api/employees');
      
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(mock_fetch_employees);
    expect(mockGetAllEmployees).toHaveBeenCalled();
  });
});

