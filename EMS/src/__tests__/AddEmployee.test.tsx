import { screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import { renderWithProviders } from '../utils/test-utils'
import AddEmployee from '../components/pages/AddEmployee';
import { server } from '../mocks/server';


const AddEmployeeFn = () => {
    return renderWithProviders(
        <BrowserRouter>
            <AddEmployee />
        </BrowserRouter>
    )
}


describe('Add Employee page', () => {

    beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    it('should allow users to type into fields', () => {
        AddEmployeeFn();
        const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
        const nameInput: HTMLInputElement = screen.getByLabelText(/Name/i);
        const designationInput: HTMLInputElement = screen.getByLabelText(/Designation/i);
        const salaryInput: HTMLInputElement = screen.getByLabelText(/Salary/i);

        fireEvent.change(emailInput, { target: { value: 'test12@test.com' } });
        fireEvent.change(nameInput, { target: { value: 'Tester12' } });
        fireEvent.change(designationInput, { target: { value: 'Manager' } });
        fireEvent.change(salaryInput, { target: { value: '2000' } });

        expect(emailInput?.value).toBe('test12@test.com');
        expect(nameInput?.value).toBe('Tester12');
        expect(designationInput?.value).toBe('Manager');
        expect(salaryInput?.value).toBe('2000');
    });

    // it('should submit form', async () => {
    //     AddEmployeeFn();

    //     const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
    //     const nameInput: HTMLInputElement = screen.getByLabelText(/Name/i);
    //     const designationInput: HTMLInputElement = screen.getByLabelText(/Designation/i);
    //     const salaryInput: HTMLInputElement = screen.getByLabelText(/Salary/i);

    //     fireEvent.change(emailInput, { target: { value: 'test12@test.com' } });
    //     fireEvent.change(nameInput, { target: { value: 'Tester12' } });
    //     fireEvent.change(designationInput, { target: { value: 'Supervisor' } });
    //     fireEvent.change(salaryInput, { target: { value: '2000' } });

    //     const submitButton = screen.getByRole('button', { name: /Submit/i });
    //     fireEvent.click(submitButton);

    //     await waitFor(() => {
    //         expect(window.location.pathname).toBe('/admin/dashboard');
    //     });
    // });

    it('should not submit form', async () => {
        AddEmployeeFn();

        const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
        const nameInput: HTMLInputElement = screen.getByLabelText(/Name/i);
        const designationInput: HTMLInputElement = screen.getByLabelText(/Designation/i);
        const salaryInput: HTMLInputElement = screen.getByLabelText(/Salary/i);
        const passwordInput: HTMLInputElement = screen.getByLabelText(/Password/i);
      

        fireEvent.change(emailInput, { target: { value: 'random12@test.com' } });
        fireEvent.change(nameInput, { target: { value: 'Random2' } });
        fireEvent.change(designationInput, { target: { value: 'Manager' } });
        fireEvent.change(salaryInput, { target: { value: '2000' } });
        fireEvent.change(passwordInput, { target: { value: 'test123' } });
   

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });

    });

    it('click on back button', async () => {
        AddEmployeeFn();

        const submitButton = screen.getByRole('button', { name: /Back/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/admin/dashboard');
        });

    });

});