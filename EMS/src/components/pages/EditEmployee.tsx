import axios from 'axios';
import { useEffect, useState, CSSProperties, type FormEvent, type ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchEmployees } from '@/redux/action';
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "#3498db",
};

const EditEmployee = () => {


    interface Employee {
        name: string,
        email: string,
        designation: string,
        salary: number
    }

    const [employeeData, setEmployeeData] = useState<Employee>({
        name: '',
        email: '',
        designation: '',
        salary: 0
    });

    let [loading, setLoading] = useState<boolean>(true);
    let [color, setColor] = useState<string>("#ffffff");

    const [load, setLoad] = useState<boolean>(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const backendURL = "http://localhost:3000/";

    const { id } = useParams();


    const localStorageData: string | null = localStorage.getItem('user');

    useEffect(() => {
        const user = JSON.parse(localStorageData);

        try {
            const response = axios.get(`${backendURL}api/employees/${id}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`, // Add the authorization header
                },
            });

            response.then((response) => setEmployeeData(response.data.data))

        } catch (error) {
            console.error('Error fetching data for edit:', error);
        }
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        setEmployeeData((prevData) => ({
            ...prevData,
            [e.target.id]: e.target.value,
        }));
    };


    const submitEditForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = JSON.parse(localStorageData);
        setLoad(true)
        try {
            const response = await axios.put(`${backendURL}api/employees/${employeeData.id}`, employeeData, {
                headers: {
                    Authorization: `Bearer ${user.token}`, // Add the authorization header
                },
            });

            if (response.data.status === 200) {
                setLoad(false)
                toast.success(response.data.message);
                dispatch(fetchEmployees());
                navigate("/admin/dashboard", { replace: true })
            }

        } catch (error) {
            setLoad(false)
            console.log("error ocurred", error.response.data.message)
            toast.warning(error.response.data.message);
            console.error('Error fetching data for Add:', error);

        }
    }

    return (
        <>
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
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
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
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
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
        </>
    );
};

export default EditEmployee;