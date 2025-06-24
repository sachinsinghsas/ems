import { fetchEmployees } from '@/redux/action';
import axios from 'axios';
import React, { useState, CSSProperties, type ChangeEvent, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ClipLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#3498db",
};

const backendURL = "http://localhost:3000/";

const AddEmployee = () => {

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

  const submitAddForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    setLoad(true)

    try {
      const response = await axios.post(`${backendURL}api/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the authorization header
        },
      });



      if (response.data.status === 201) {
        setLoad(false)
        toast.success(response.data.message);
        dispatch(fetchEmployees());
        navigate("/admin/dashboard", { replace: true })

      }

    } catch (error) {
      setLoad(false)
      console.log("error ocurred", error.response.data.message)
      toast.warning(error.response.data.message);
      console.error('Error fetching data for add:', error);
      // Handle error (e.g., display an error message)
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
            placeholder="Your Name"
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
            placeholder="Your Email"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Designation:
          </label>
          <input
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
    </>
  );
};

export default AddEmployee;