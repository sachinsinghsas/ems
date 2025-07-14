import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';

// Mocks
jest.unstable_mockModule('../models/employeeModel.js', () => ({
  createEmployeeService: jest.fn(),
  getAllEmployeesService: jest.fn(),
  employeeByIdService: jest.fn(),
  updateEmployeeService: jest.fn(),
  deleteEmployeeService: jest.fn(),
  loginAuthenticate: jest.fn(),
}));

jest.unstable_mockModule('../utils/handleResponse.js', () => ({
  handleResponse: jest.fn(),
}));

jest.unstable_mockModule('../utils/verifyToken.js', () => ({
  default: jest.fn(() => true), 
}));

const controllerModule = await import('../controllers/employeeController.js');
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  login
} = controllerModule;


const {
  createEmployeeService,
  getAllEmployeesService,
  employeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
  loginAuthenticate
} = await import('../models/employeeModel.js');

const { handleResponse } = await import('../utils/handleResponse.js');

describe('Employee Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const req = httpMocks.createRequest({
        body: {
          name: 'John',
          email: 'john@example.com',
          designation: 'Manager',
          salary: 50000,
          password: '345sade',
          confirm_password: '345sade',
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const mockEmployee = { id: 1, name: 'John' };
      createEmployeeService.mockResolvedValue(mockEmployee);

      await createEmployee(req, res, next);

      expect(createEmployeeService).toHaveBeenCalled();
      expect(handleResponse).toHaveBeenCalledWith(res, 201, 'Employee created successfully', mockEmployee);
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const employees = [{ id: 1 }, { id: 2 }];
      getAllEmployeesService.mockResolvedValue(employees);

      await getAllEmployees(req, res, next);

      expect(getAllEmployeesService).toHaveBeenCalled();
    
      expect(handleResponse).toHaveBeenCalledWith(res, 200, 'Employees fetched successfully', employees);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee if found', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const employee = { id: 1, name: 'Alice' };
      employeeByIdService.mockResolvedValue(employee);

      await getEmployeeById(req, res, next);

      expect(employeeByIdService).toHaveBeenCalledWith('1');
      expect(handleResponse).toHaveBeenCalledWith(res, 200, 'Employee fetched successfully', employee);
    });

    it('should return 404 if employee not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '99' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      employeeByIdService.mockResolvedValue(null);

      await getEmployeeById(req, res, next);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, 'Employee not found');
    });
  });

  describe('updateEmployee', () => {
    it('should update employee', async () => {
      const req = httpMocks.createRequest({
        params: { id: '1' },
        body: {
          name: 'Updated Name',
          email: 'updated@example.com',
          designation: 'Manager',
          salary: 60000,
        },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const updated = { id: 1, name: 'Updated Name' };
      updateEmployeeService.mockResolvedValue(updated);

      await updateEmployee(req, res, next);

      expect(updateEmployeeService).toHaveBeenCalled();
      expect(handleResponse).toHaveBeenCalledWith(res, 200, 'Employee updated successfully', updated);
    });

    it('should return 404 if employee not found', async () => {
      const req = httpMocks.createRequest({
        params: { id: '999' },
        body: {},
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      updateEmployeeService.mockResolvedValue(null);

      await updateEmployee(req, res, next);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, 'Employee not found');
    });
  });

  describe('deleteEmployee', () => {
    it('should delete employee', async () => {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const deleted = { id: 1 };
      deleteEmployeeService.mockResolvedValue(deleted);

      await deleteEmployee(req, res, next);

      expect(deleteEmployeeService).toHaveBeenCalled();
      expect(handleResponse).toHaveBeenCalledWith(res, 200, 'Employee deleted successfully', deleted);
    });

    it('should return 404 if employee not found', async () => {
      const req = httpMocks.createRequest({ params: { id: '999' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      deleteEmployeeService.mockResolvedValue(null);

      await deleteEmployee(req, res, next);

      expect(handleResponse).toHaveBeenCalledWith(res, 404, 'Employee not found');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'admin@example.com', password: 'pass' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      const adminUser = { id: 1, email: 'admin@example.com' };
      loginAuthenticate.mockResolvedValue(adminUser);

      await login(req, res, next);

      expect(loginAuthenticate).toHaveBeenCalled();
      expect(handleResponse).toHaveBeenCalledWith(res, 200, 'Employee fetched successfully', adminUser);
    });

    it('should return 403 for invalid login', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'bad@example.com', password: 'wrong' },
      });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      loginAuthenticate.mockResolvedValue(null);

      await login(req, res, next);

      expect(handleResponse).toHaveBeenCalledWith(res, 403, 'Invalid login credentials');
    });
  });
});
