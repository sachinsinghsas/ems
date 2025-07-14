import { act } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/pages/LoginForm';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../utils/test-utils'
import { server } from '../mocks/server';


const loginForm = () => {
  return renderWithProviders(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  )
}

jest.mock('axios');

describe('Login Component', () => {

  beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should render the login form', () => {

    loginForm();

    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('should allow users to type into the email and password fields', () => {
    loginForm();

    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);

    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
    fireEvent.change(passwordInput, { target: { value: 'test1234' } });

    expect(emailInput?.value).toBe('test@test.com');
    expect(passwordInput?.value).toBe('test1234');
  });


  it('should login if correct credentials used', async () => {
    loginForm();
    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });


    fireEvent.change(emailInput, { target: { value: 'right@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'sddds23456' } });
    fireEvent.click(submitButton);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

  });

  it('return back to login page if wrong credentials used', async () => {
    loginForm();
    const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
    const submitButton = screen.getByRole('button', { name: /Sign In/i });


    fireEvent.change(emailInput, { target: { value: 'wrong@gmail.com' } });
    fireEvent.change(passwordInput, { target: { value: 'sddds23456' } });
    fireEvent.click(submitButton);

    await act(async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Login')).toBeInTheDocument();
    });

  });

});