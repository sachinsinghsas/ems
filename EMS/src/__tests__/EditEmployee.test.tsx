import { screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/jest-globals';
import '@testing-library/jest-dom';
import EditEmployee from '../components/pages/EditEmployee';
import { renderWithProviders } from '../utils/test-utils'
import { server } from '../mocks/server';


const EditEmployeeFn = () => {
    return renderWithProviders(
        <BrowserRouter>
            <EditEmployee />
        </BrowserRouter>
    )
}


describe('Edit Employee page', () => {

    beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    it('should allow users to type into fields', () => {
        EditEmployeeFn();
        const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
        const nameInput: HTMLInputElement = screen.getByLabelText(/Name/i);
        const designationInput: HTMLInputElement = screen.getByLabelText(/Designation/i);
        const salaryInput: HTMLInputElement = screen.getByLabelText(/Salary/i);

        fireEvent.change(emailInput, { target: { value: 'Matt12@test.com' } });
        fireEvent.change(nameInput, { target: { value: 'Matt' } });
        fireEvent.change(designationInput, { target: { value: 'Supervisor' } });
        fireEvent.change(salaryInput, { target: { value: '2000' } });

        expect(emailInput?.value).toBe('Matt12@test.com');
        expect(nameInput?.value).toBe('Matt');
        expect(designationInput?.value).toBe('Supervisor');
        expect(salaryInput?.value).toBe('2000');
    });

    it('should not submit form as salary is very less', async () => {
        EditEmployeeFn();

        const emailInput: HTMLInputElement = screen.getByLabelText(/Email/i);
        const nameInput: HTMLInputElement = screen.getByLabelText(/Name/i);
        const designationInput: HTMLInputElement = screen.getByLabelText(/Designation/i);
        const salaryInput: HTMLInputElement = screen.getByLabelText(/Salary/i);

        fireEvent.change(emailInput, { target: { value: 'random142@test.com' } });
        fireEvent.change(nameInput, { target: { value: 'Random24' } });
        fireEvent.change(designationInput, { target: { value: 'Manager' } });
        fireEvent.change(salaryInput, { target: { value: '1' } });

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/');
        });

    });

    it('click on back button', async () => {
        EditEmployeeFn();

        const submitButton = screen.getByRole('button', { name: /Back/i });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.location.pathname).toBe('/admin/dashboard');
        });
    });

});