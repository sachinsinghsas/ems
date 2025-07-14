import errorHandling from '../middlewares/errorHandler.js';
import httpMocks from 'node-mocks-http';
import { jest } from '@jest/globals';

describe('Centralized Error Handling Middleware', () => {
  it('should respond with 500 and error details', () => {
    const error = new Error('Something went wrong');
    error.stack = 'Mock stack trace';

    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const jsonMock = jest.fn();
    res.status = jest.fn(() => ({ json: jsonMock }));

    errorHandling(error, req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 500,
      message: 'Something went wrong',
      error,
    });
  });
});
