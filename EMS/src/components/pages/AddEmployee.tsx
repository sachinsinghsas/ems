import { createEmployee, fetchEmployees } from '@/redux/action';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppDispatch } from '../../redux/store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";
import Header from './Header';

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3498db",
};

const uncaught_error = 'Something went wrong!';
const AddEmployee = () => {

  interface Employee {
    id: number,
    name: string,
    email: string,
    designation: string,
    salary: number,
    password: string,
    confirm_password: string
  }

  const [employeeData, setEmployeeData] = useState<Employee>({
    id: 0,
    name: '',
    email: '',
    designation: '',
    salary: 0,
    password: '',
    confirm_password: ''
  });

  let [loading, setLoading] = useState<boolean>(true);
  let [color, setColor] = useState<string>("#ffffff");

  const [load, setLoad] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const submitAddForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoad(true)

    const response = await dispatch(createEmployee(employeeData));
    setLoad(false)
    if (!response?.payload?.status) {
      console.error("uncaught Error:", response);
      toast.error(uncaught_error);
    }

     if (response?.payload?.status === 403) {
                toast.warning(response?.payload?.message);
                navigate("/"),{ replace: true };
        }

    if (response?.payload?.status === 201) {
      toast.success(response?.payload?.message);
      dispatch(fetchEmployees());
      navigate("/admin/dashboard", { replace: true })
    } else {
      toast.warning(response.payload.message);
      console.log('Error while submitting data for add:', response);
    }

  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setEmployeeData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen justify-center bg-gray-100 font-sans leading-normal tracking-normal">

        <main className='w-70'>
          <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
          <form onSubmit={submitAddForm}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                onChange={handleChange}
                value={employeeData?.name}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Name"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                onChange={handleChange}
                value={employeeData?.email}
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="designation" className="block text-gray-700 text-sm font-bold mb-2">
                Designation:
              </label>
              <input
                value={employeeData?.designation}
                onChange={handleChange}
                type="text"
                id="designation"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Designation"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">
                Salary:
              </label>
              <input
                value={employeeData?.salary}
                onChange={handleChange}
                type="number"
                id="salary"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Salary"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                value={employeeData?.password}
                onChange={handleChange}
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
              />

            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Confirm  Password
              </label>
              <input
                value={employeeData?.confirm_password}
                onChange={handleChange}
                type="password"
                id="confirm_password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm Password"
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
              /> : <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>}


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

export default AddEmployee;