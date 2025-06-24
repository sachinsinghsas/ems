import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectAuth } from "@/redux/reducer";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import Header from "./Header";
import axios from "axios";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  Search,
  IndianRupee,
  BriefcaseBusiness,
  SquarePen,
  User,
  Trash2,
} from "lucide-react";
import React from "react";
import { fetchEmployees } from "@/redux/action";

const Dashboard = () => {
  const { info, token, employeeInfo, error } = useSelector(selectAuth);
 
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    designation: '',
    salary: ''
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const data = employeeInfo;

  const user = JSON.parse(localStorage.getItem('user')); // Retrieve your authorization token

  const backendURL = "http://localhost:3000/";

  const dispatch = useDispatch();

  // Effect to handle window resize for drawer behavior
  useEffect(() => {
    const handleResize = () => {
      // Close drawer on small screens if it's open and user resizes to large
      if (window.innerWidth >= 1024 && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDrawerOpen]); // Dependency array: run effect when isDrawerOpen changes

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

 

  const addEmployee = () => {
    setEmployeeData({
    name: '',
    email: '',
    designation: '',
    salary: ''
  });
  navigate("/admin/create/employee")
    setShowAddModal(true);
  }

  const editRow = async (id: number) => {
    try {
      const response = await axios.get(`${backendURL}api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the authorization header
        },
      });
      setEmployeeData(response.data.data);
    } catch (error) {
      console.error('Error fetching data for edit:', error);
      // Handle error (e.g., display an error message)
    }
    setShowModal(true);
  }

  const handleChange = (e) => {
    e.preventDefault();

    setEmployeeData((prevData) => ({
      ...prevData,
      [e.target.id]: e.target.value,
    }));
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    console.log('edit form data', employeeData);

    try {
      const response = await axios.put(`${backendURL}api/employees/${employeeData.id}`, employeeData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the authorization header
        },
      });

      setShowModal(false);
      if (response.data.status === 200) {
         toast.success(response.data.message);
         dispatch(fetchEmployees());
      }
      console.log('checker edit', response.data)
    
    } catch (error) {
      console.log("error ocurred",error.response.data.message)
      toast.warning(error.response.data.message);
      console.error('Error fetching data for Add:', error);
 
    }
  }

   const submitAddForm = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));

    try {
      const response = await axios.post(`${backendURL}api/employees`, employeeData, {
        headers: {
          Authorization: `Bearer ${user.token}`, // Add the authorization header
        },
      });

      setShowAddModal(false);
    
      if (response.data.status === 201) {
        toast.success(response.data.message);
        dispatch(fetchEmployees());
      }

    } catch (error) {
      console.log("error ocurred",error.response.data.message)
      toast.warning(error.response.data.message);
      console.error('Error fetching data for add:', error);
      // Handle error (e.g., display an error message)
    }
  }


  //Columns of React Table
  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => (
        <span className="flex items-center">
          <User className="mr-2" size={16} /> Name
        </span>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      cell: (info) => (
        <span className="italic text-blue-600">{info.getValue()}</span>
      ),
      header: () => (
        <span className="flex items-center">
          <Mail className="mr-2" size={16} /> Email
        </span>
      ),
    }),
    columnHelper.accessor("designation", {
      header: () => (
        <span className="flex items-center">
          <BriefcaseBusiness className="mr-2" size={16} /> Designation
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("salary", {
      header: () => (
        <span className="flex items-center">
          <IndianRupee className="mr-2" size={16} /> Salary
        </span>
      ),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("id", {
      header: () => (
        <span className="flex items-center">
          Action
        </span>
      ),
      cell: (info) => <SquarePen onClick={() => { editRow(info.getValue()) }} className="mr-2" size={16} />,
    })
  ];
  //React table


  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  return (
    <>
      <div className="flex min-h-screen bg-gray-100 font-sans leading-normal tracking-normal">
     {showAddModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-2 rounded-lg p-8 max-w-md w-full relative">
              <button
                onClick={handleCloseAddModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
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
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white border-2 rounded-lg p-8 max-w-md w-full relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              >
                &times;
              </button>
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
                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Overlay for small screens when drawer is open */}
        {isDrawerOpen && window.innerWidth < 1024 && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30"
            onClick={closeDrawer}
          ></div>
        )}

        <Sidebar isOpen={isDrawerOpen} onClose={closeDrawer} />

        <main
          className={`flex-1 transition-all duration-300 ease-in-out p-6 lg:p-8
                    ${isDrawerOpen && window.innerWidth < 1024 ? "ml-0" : ""}
                    ${window.innerWidth >= 1024 ? "lg:ml-2" : ""}
                `}
        >
          <Header onMenuToggle={toggleDrawer} />

          {/* Dashboard Content Grid */}
          <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
             <div className="flex flex-row justify-end">
             <button
                    onClick={()=>addEmployee()}
                    className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 mb-2 float-right rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Employee
                  </button>
                  </div>
            <div className="mb-4 relative">
              <input
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none flex items-center"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <ArrowUpDown className="ml-2" size={14} />
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-700">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="mr-2">Items per page</span>
                <select
                  className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20, 30].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>

               <div>
      {/* Table rendering using table.getRowModel().rows */}

      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {/* Render page number buttons */}
        {Array.from({ length: table.getPageCount() }).map((_, index) => (
          <button
            key={index}
            onClick={() => table.setPageIndex(index)}
            className={`px-3 py-1 rounded ${
              table.getState().pagination.pageIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
