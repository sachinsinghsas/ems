import { http, HttpResponse } from 'msw';
import { domain_name } from '@/utils/domain_name';


export const handlers = [
    http.post(`${domain_name}/api/login`, async ({ request }) => {

        const requestBody = await request.json();

        type ISubmittedData = {
            email: string;
            password: string;
        }

        const formData = requestBody as ISubmittedData;

        if (formData.email === 'wrong@gmail.com') {
            return new HttpResponse(JSON.stringify({ message: 'Internal Server Error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return HttpResponse.json({
            "status": 200,
            "message": "Employees fetched successfully",
            "data": [
                {
                    "id": 1,
                    "name": "Mack Doe",
                    "email": "mack@gmail.com",
                    "designation": "Supervisor",
                    "salary": "2000"
                },
                {
                    "id": 2,
                    "name": "Raul",
                    "email": "raul@gmail.com",
                    "designation": "Supervisor",
                    "salary": "2000"
                }
            ]
        })

    }),
    http.post(`${domain_name}/api/employees`, async ({ request }) => {

        const requestBody = await request.json();

        type ISubmittedData = {
            id: number;
            name: string;
            email: string;
            designation: string;
            salary: number;
        }

        const formData = requestBody as ISubmittedData;

        if (formData.designation === 'Manager') {
            return new HttpResponse(JSON.stringify({ message: 'Internal Server Error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

        }
        return HttpResponse.json({
            status: 201,
            message: "Employee created successfully",
            data: requestBody,
        })

    }),
    http.get(`${domain_name}/api/employees`, async ({ request }) => {

        return HttpResponse.json({
            "status": 200,
            "message": "Employees fetched successfully",
            "data": [
                {
                    "id": 1,
                    "name": "John Doe",
                    "email": "juhj@gmail.com",
                    "designation": "Supervisor",
                    "salary": "2000"
                },
                {
                    "id": 2,
                    "name": "cfsaf",
                    "email": "dfsssssssssfdfs@gmail.com",
                    "designation": "Supervisor",
                    "salary": "2000"
                },
                {
                    "id": 3,
                    "name": "sdafsa",
                    "email": "ffss@gmail.com",
                    "designation": "Supervisor",
                    "salary": "1000"
                },
                {
                    "id": 4,
                    "name": "dasda",
                    "email": "sdssdd@gmail.com",
                    "designation": "Supervisor",
                    "salary": "1000",
                }
            ]
        })

    }),
    http.get(`${domain_name}/api/employees/:id`, async ({ request }) => {

        return HttpResponse.json({
            "status": 200,
            "message": "Employee fetched successfully",
            "data": {
                "id": 2,
                "name": "Lorem ipsum",
                "email": "loremipsum@gmail.com",
                "designation": "Supervisor",
                "salary": "2000"
            }
        })

    }),
    http.put(`${domain_name}/api/employees/:id`, async ({ request, params }) => {
        const formData = await request.json();

        type ISubmittedData = {
            id: number;
            name: string;
            email: string;
            designation: string;
            salary: number;
        }

        const employeeData = formData as ISubmittedData;

        if (employeeData.salary < 2000) {
            return new HttpResponse(JSON.stringify({ message: 'Internal Server Error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return HttpResponse.json({
            "status": 200,
            "message": "Employee updated successfully",
            "data": {
                "id": 2,
                "name": "Lorem ipsum",
                "email": "loremipsum@gmail.com",
                "designation": "Supervisor",
                "salary": "2000"
            }
        })

    }),

];