import { screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { fetchEmployees } from '../redux/action';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../utils/test-utils';
import axios from 'axios';
import Dashboard from '../components/pages/Dashboard';
import AddEmployee from '../components/pages/AddEmployee';
import { domain_name } from '@/utils/domain_name';


jest.mock('axios');


const DashboardFn = () => {
  return renderWithProviders(
    <BrowserRouter>
      <Dashboard />
      <AddEmployee />
    </BrowserRouter>
  )
}


describe('Dashboard page', () => {

  afterEach(() => {
    jest.resetAllMocks(); // Resets mocks after each test
  });

  it('Check table is available on dashboard page', () => {
    DashboardFn();

    expect(screen.getByRole('columnheader', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Email/i })).toBeInTheDocument();


    expect(screen.getByText(/Items per page/i)).toBeInTheDocument();
  });

  it('Search feature', () => {
    DashboardFn();
    const searchInput: HTMLInputElement = screen.getByPlaceholderText(/Search.../i);
    fireEvent.change(searchInput, { target: { value: 'check search' } });
    expect(searchInput?.value).toBe('check search');
  });

  it('Add employee button click', async () => {
    DashboardFn();
    const button = screen.getByRole('button', { name: /Add Employee/i });
    fireEvent.click(button);
    expect(screen.getByText(/Back/i)).toBeInTheDocument();
  });


  it('should fetch employees', async () => {

    const mockResponse = {
      data: {
        "id": 1,
        "name": "John Doe",
        "designation": "Manager",
        "email": "John@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Y"
      }
    }

    axios.get = jest.fn().mockResolvedValue(mockResponse);
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn(() => ({}));

    await fetchEmployees()(mockDispatch, mockGetState, undefined);

    expect(axios.get).toHaveBeenCalledTimes(1);

    expect(axios.get).toHaveBeenCalledWith(
      `${domain_name}/api/employees`,
      {"withCredentials": true}
);

  });

  it('should not fetch employees', async () => {

    const errorMessage = 'Validation failed: Invalid input';
    const mockError = {
      response: {
        data: {
          message: errorMessage,
        },
        status: 400
      },
    };

    axios.get = jest.fn().mockRejectedValue(mockError);

    const mockDispatch = jest.fn();
    const mockGetState = jest.fn(() => ({}));

    let data: any = await fetchEmployees()(mockDispatch, mockGetState, undefined);
 
    expect(errorMessage).toContain(data.payload.message);
  });

  it('check pagination', async () => {
    DashboardFn();
    const button = screen.getByRole('button', { name: /Previous/i });
    expect(button).toBeDisabled();
  });

});