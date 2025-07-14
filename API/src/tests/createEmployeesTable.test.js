import { jest } from '@jest/globals';

// Mock bcrypt and pool
jest.unstable_mockModule('bcryptjs', () => ({
  default: {
    hash: jest.fn(),
  },
}));

jest.unstable_mockModule('../config/db.js', () => ({
  default: {
    query: jest.fn(),
  },
}));

// After mocking, import the module to test
const bcrypt = (await import('bcryptjs')).default;
const pool = (await import('../config/db.js')).default;
const createEmployeesTable = (await import('../data/createEmployeesTable.js')).default;

describe('createEmployeesTable', () => {
    
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'adminpass';
  });
  

  it('should create the employees table and insert default admin if not present', async () => {
    // Mock table creation and checking for existing user
    pool.query
      .mockResolvedValueOnce({}) // Table creation
      .mockResolvedValueOnce({ rows: [undefined] }) // Check for admin
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Insert admin

    bcrypt.hash.mockResolvedValue('hashedpassword');

    await createEmployeesTable();

    expect(pool.query).toHaveBeenCalledTimes(3);
    expect(bcrypt.hash).toHaveBeenCalledWith('adminpass', 10);
    expect(pool.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO employees'), expect.any(Array));
  });

  it('should not insert admin if one already exists', async () => {
    pool.query
      .mockResolvedValueOnce({}) // Table creation
      .mockResolvedValueOnce({ rows: [{ id: 1 }] }); // Admin exists

    await createEmployeesTable();

    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });

  it('should catch and log errors', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    pool.query.mockRejectedValue(new Error('DB Error'));

    await createEmployeesTable();

    expect(consoleSpy).toHaveBeenCalledWith('Issue while generating table', expect.any(Error));

    consoleSpy.mockRestore();
  });
});
