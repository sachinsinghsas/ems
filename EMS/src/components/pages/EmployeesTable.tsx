import React, { useMemo, useEffect, useState, useCallback, type SetStateAction } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from '@tanstack/react-table';
import { useNavigate, useSearchParams } from 'react-router-dom';
import "../../assets/table.css";
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/reducer';

let allUsers: Array<string> = [];

interface apiCall {
    page: number;
    limit: number;
    sortBy: string;
}

const simulateApiCall = ({ page, limit, sortBy }: apiCall) => {
  
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredData = [...allUsers];

      // Simulate sorting on the backend
      if (sortBy && sortBy.length > 0) {
        const { id, desc } = sortBy[0];
        filteredData.sort((a, b) => {
          const aValue = a[id];
          const bValue = b[id];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return desc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
          }
          return desc ? bValue - aValue : aValue - bValue;
        });
      }

      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      resolve({
        data: paginatedData,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      });
    }, 500); // Simulate network delay
  });
};

// --- React Component ---
const EmployeesTable: React.FC = () => {

   const { employeeInfo } = useSelector(selectAuth);
 
   allUsers = employeeInfo;

  const [searchParams, setSearchParams] = useSearchParams();

  const [tableData, setTableData] = useState<Array<number>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0); // Total pages from backend

  // State for react-table pagination (controlled by URL params)
  const [pagination, setPagination] = useState({
    pageIndex: parseInt(searchParams.get('page')) - 1 || 0, // 0-based for TanStack Table
    pageSize: parseInt(searchParams.get('limit')) || 10,
  });

  // State for react-table sorting (controlled by URL params)
  const [sorting, setSorting] = useState(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) {
      const [id, order] = sortParam.split(':');
      return [{ id, desc: order === 'desc' }];
    }
    return [];
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        cell: info => `₹${info.getValue().toLocaleString()}`,
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
      },
      {
        accessorKey: 'id',
        id: 'actions', // Unique ID for the column
        header: 'Actions',
        enableSorting: false, // Actions column should not be sortable
        cell: info => (
          <div>
            <button onClick={() => navigate(`/admin/edit/employee/${info.getValue()}`)}>Edit</button>
           
          </div>
        ),
      },
    ],
    []
  );

  // Update URL query parameters based on TanStack Table's internal state
  const onPaginationChange = useCallback(updater => {
    setPagination(old => {
      const newPaginationState = typeof updater === 'function' ? updater(old) : updater;
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', newPaginationState.pageIndex + 1); // Convert to 1-based for URL
      newSearchParams.set('limit', newPaginationState.pageSize);
      setSearchParams(newSearchParams); // Update URL
      return newPaginationState;
    });
  }, [searchParams, setSearchParams]);

  const onSortingChange = useCallback(updater => {
    setSorting(old => {
      const newSortingState = typeof updater === 'function' ? updater(old) : updater;
      const newSearchParams = new URLSearchParams(searchParams);

      if (newSortingState && newSortingState.length > 0) {
        const { id, desc } = newSortingState[0];
        newSearchParams.set('sort', `${id}:${desc ? 'desc' : 'asc'}`);
      } else {
        newSearchParams.delete('sort');
      }
      setSearchParams(newSearchParams);
      return newSortingState;
    });
  }, [searchParams, setSearchParams]);

  const table = useReactTable({
    data: tableData, // Data for the current page
    columns,
    pageCount: pageCount, // Total pages from backend
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: onPaginationChange,
    onSortingChange: onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, // We handle pagination ourselves
    manualSorting: true, // We handle sorting ourselves
  });

  // Fetch data whenever pageIndex, pageSize, or sorting from URL change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await simulateApiCall({
        page: pagination.pageIndex + 1, // API expects 1-based page
        limit: pagination.pageSize,
        sortBy: sorting,
      });
    
      setTableData(result.data);
      setPageCount(result.totalPages);
      setLoading(false);
    };

    fetchData();
  }, [pagination, sorting]); 

  // Effect to update internal pagination/sorting state when URL changes externally
  // (e.g., user hits back button, or types URL directly)

  useEffect(() => {
    const newPageIndex = parseInt(searchParams.get('page')) - 1 || 0;
    const newPageSize = parseInt(searchParams.get('limit')) || 10;

    const sortParam = searchParams.get('sort');
    let newSorting = [];
    if (sortParam) {
      const [id, order] = sortParam.split(':');
      newSorting: newSorting = [{ id, desc: order === 'desc' }];
    }

    if (newPageIndex !== pagination.pageIndex || newPageSize !== pagination.pageSize) {
      // Don't use onPaginationChange here to avoid circular updates to URL
      setPagination({ pageIndex: newPageIndex, pageSize: newPageSize });
    }
    if (JSON.stringify(newSorting) !== JSON.stringify(sorting)) {
      // Don't use onSortingChange here to avoid circular updates to URL
      setSorting(newSorting);
    }
  }, [searchParams]); // Trigger when searchParams object changes

  const navigate = useNavigate();
   const addEmployee = () => {
  navigate("/admin/add/employee")

  }

  return (
    <div className="table-container bg-gray-100">
      <h1>Employees</h1>
      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
           <button
                    onClick={()=>addEmployee()}
                    className="bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 mb-2 float-right rounded focus:outline-none focus:shadow-outline"
                  >
                    Add Employee
                  </button>
                  
          <table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()} // Sorting handler
                      className={header.column.getCanSort() ? 'sortable' : ''}
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted()] ?? ''}
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>No data available</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>{' '}
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>{' '}
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>{' '}
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>{' '}
            </span>
            <span>
              | Go to page:{' '}
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                style={{ width: '50px' }}
              />
            </span>{' '}
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeesTable;