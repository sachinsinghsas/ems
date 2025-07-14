import { handleResponse } from '../utils/handleResponse.js';
import { jest } from '@jest/globals';

describe('handleResponse', () => {
  it('should send a JSON response with status, message, and data', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const status = 200;
    const message = 'Success';
    const data = { id: 1, name: 'Sachin' };

    handleResponse(res, status, message, data);

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({
      status,
      message,
      data,
    });
  });

  it('should send a JSON response with null data if data is not provided', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const status = 404;
    const message = 'Not found';

    handleResponse(res, status, message);

    expect(res.status).toHaveBeenCalledWith(status);
    expect(res.json).toHaveBeenCalledWith({
      status,
      message,
      data: null,
    });
  });
});
