import { useEffect, useState, type FormEvent, type ChangeEvent } from 'react';
import { useAppDispatch } from '../../redux/store';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEmployee, fetchEmployees, updateEmployee } from '@/redux/action';
import { ClipLoader } from "react-spinners";
import Header from './Header';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#3498db",
};

const uncaught_error = 'Something went wrong!';

const EditEmployee = () => {


    interface Employee {
        id: number,
        name: string,
        email: string,
        designation: string,
        salary: number
    }

    const [employeeData, setEmployeeData] = useState<Employee>({
        id: 0,
        name: '',
        email: '',
        designation: '',
        salary: 0
    });

    let [loading, setLoading] = useState<boolean>(true);
    let [color, setColor] = useState<string>("#ffffff");

    const [load, setLoad] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    const empId: number = Number(id)

    useEffect(() => {
        try {
            const response = fetchEmployeeData(empId);
            response.then((response) => {
             
                if (response?.payload?.data) {
                    setEmployeeData(response.payload.data)
                } else {
                    console.log("uncaught Error:", response);
                    toast.error(uncaught_error);
                }
            }

            )
        } catch (error) {
            console.log('Error fetching data for edit:', error);
        }
    }, []);

    const fetchEmployeeData = async (empId: number) => {
        const data = await dispatch(fetchEmployee(empId));
        return data;
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setEmployeeData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };


    const submitEditForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoad(true)

        const response = await dispatch(updateEmployee(employeeData));
        
        setLoad(false)
        if (!response?.payload?.status) {
            console.log("uncaught Error:", response);
            toast.error(uncaught_error);
        }
        
        if (response?.payload?.status === 403) {
            toast.warning(response?.payload?.message);
            navigate("/"),{ replace: true };
        }

        if (response?.payload?.status === 200) {
            toast.success(response.payload.message);
            dispatch(fetchEmployees());
            navigate("/admin/dashboard", { replace: true })
        } else {
            toast.warning(response?.payload?.message);
            console.log('Error submitting data for edit::', response);
        }
    }

    return (
        <>
            <Header />
            <div className="flex min-h-screen justify-center bg-gray-100 font-sans leading-normal tracking-normal">

                <main className='w-70'>
                    <h2 className="text-2xl font-bold mb-4">Edit Employee</h2>
                    <form onSubmit={submitEditForm}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                                Name:
                            </label>
                            <input
                                required
                                type="text"
                                id="name"
                                onChange={handleChange}
                                value={employeeData?.name}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                                Email:
                            </label>
                            <input
                                readOnly
                                required
                                onChange={handleChange}
                                value={employeeData?.email}
                                type="email"
                                id="email"
                                className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="designation" className="block text-gray-700 text-sm font-bold mb-2">
                                Designation:
                            </label>
                            <input
                                required
                                value={employeeData?.designation}
                                onChange={handleChange}
                                type="text"
                                id="designation"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Designation"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">
                                Salary:
                            </label>
                            <input
                                required
                                value={employeeData?.salary}
                                onChange={handleChange}
                                type="number"
                                id="salary"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Salary"
                            />
                        </div>
                        <div className="flex">
                            {load ? <ClipLoader
                                color={color}
                                loading={loading}
                                cssOverride={override}
                                size={50}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                            /> :
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Submit
                                </button>
                            }
                            <button
                                type="button"
                                onClick={() => navigate("/admin/dashboard")}
                                className="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Back
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
};

export default EditEmployee;