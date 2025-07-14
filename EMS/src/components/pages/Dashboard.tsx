import { selectAuth } from '../../redux/reducer';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type CellContext
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Mail,
  IndianRupee,
  BriefcaseBusiness,
  SquarePen,
  Search,
  User
} from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from './Header';

const Dashboard: React.FC = () => {

  let { employeesInfo } = useSelector(selectAuth);
 
  const data = employeesInfo as unknown[];

  const navigate = useNavigate();

  const addEmployee = () => {
    navigate("/admin/add/employee")
  }

  // React Table
  const columnHelper = createColumnHelper();


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
      cell: (info: CellContext<unknown, never>) => (
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
      cell: (info) => <SquarePen onClick={() => navigate(`/admin/edit/employee/${info.getValue()}`)} className="mr-2" size={16} />,
    })
  ];

  //React table
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

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
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Header />
    <div className="flex min-h-screen bg-gray-100 font-sans leading-normal tracking-normal">
    
      <main className='w-full'>

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

        <div className="overflow-x bg-white shadow-md rounded-lg">
          <button
            onClick={() => addEmployee()}
            name="Add Employee"
            className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 mb-2 mt-2 mr-2 float-right rounded focus:outline-none focus:shadow-outline"
          >
            Add Employee
          </button>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              {table?.getHeaderGroups.length ? (table.getHeaderGroups().map((headerGroup) => (
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
              ))) : 'Loading...'}

            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table?.getRowModel ? (table.getRowModel().rows.map((row) => (
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
              ))) : 'Loading...'}

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
                  className={`px-3 py-1 rounded ${table.getState().pagination.pageIndex === index
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
      </main>
    </div>
    </>

  );
};

export default Dashboard;
