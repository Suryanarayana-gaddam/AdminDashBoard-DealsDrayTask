import React, { useEffect, useMemo, useState } from 'react';
import useFetch from '../hooks/useFetch';
import "./empTable.css"
import { Link } from 'react-router-dom';
import { FaSort } from 'react-icons/fa6';
const EmployeeTable = () => {
    const [employees, setEmployees] = useState([]);
    const [url, setUrl] = useState(null);
    const { data, error } = useFetch(url);
    const [profilePic, setProfilePic] = useState(null);
    const userName = localStorage.getItem("username");

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const empsPerPage = 5;
    const maxPageNumbers = 10;

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig.key !== null) {
          sortableData.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
          });
        }
        return sortableData;
      }, [data, sortConfig]);
    
      const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
      };
    
      const handleSearch = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
      };
    
      const filteredData = sortedData.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchQuery)
        )
      );

      useEffect(() => {
        if (userName) {
            const fetchUrl = `https://admin-dash-board-api.vercel.app/get/employees/${userName}`;
            setUrl(fetchUrl);
        }
    }, [userName]);

    useEffect(() => {
        if (data) {
            setEmployees(data);
            setProfilePic(data.img);
        }
    }, [data]);

    if (error) {
        return <div>Error fetching data</div>;
    }

    const handleDeleteEmployee = (event,employeeId,employeeName) => {
        event.preventDefault();
        const isConfirmed = window.confirm(`Do you want to delete ${employeeName} ?`);
        if(isConfirmed){
            fetch(`https://admin-dash-board-api.vercel.app/delete/employee/${employeeId}`,{
                method: "DELETE",
                headers : {
                    "Content-type" : "application/json"
                }
            }).then(res => res.json())
            .then(data => {
                setEmployees(employees.filter(emp => emp._id !== employeeId));
                window.alert(`${employeeName} was deleted successfully!`);
            })
        }
    }


    if (!employees.length) {
            return <div className="flex items-center justify-center h-screen">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                </div>
            </div>
        </div>;
        }

        const indexOfLastEmp = currentPage * empsPerPage;
        const indexOfFirstEmp = indexOfLastEmp - empsPerPage;
        const currentEmps = filteredData? filteredData.slice(indexOfFirstEmp, indexOfLastEmp) : ""
        
        
          // Calculate total number of pages
          const totalPages = Math.ceil(filteredData.length / empsPerPage);
        
          // Generate array of page numbers to display
          const getPageNumbers = () => {
            let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
            let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);
        
            // Adjust startPage when near the end of totalPages
            if (endPage - startPage + 1 < maxPageNumbers) {
              startPage = Math.max(1, endPage - maxPageNumbers + 1);
            }
        
          let pageNumbers = Array.from({ length: (endPage - startPage) + 1 }, (_, index) => startPage + index);
        
        
          // Include multiples of 50
          const multiplesOf3 = Array.from({ length: Math.ceil(totalPages / 3)-1 }, (_, index) => (index + 1) * 3);
          pageNumbers = [...pageNumbers.filter(num => !multiplesOf3.includes(num)), ...multiplesOf3];
        
          // Add last page if it's not already included
          if (!pageNumbers.includes(totalPages)) {
            pageNumbers.push(totalPages);
          }
        
          return pageNumbers.sort((a, b) => a - b);
        };
        
        const paginate = (pageNumber) => {
          setCurrentPage(pageNumber);
        };
        
        const goToPreviousPage = () => {
          setCurrentPage((prevPage) => prevPage - 1);
        };
        
        const goToNextPage = () => {
          setCurrentPage((prevPage) => prevPage + 1);
        };

    return (
        <div >
            <div className=' '>
            <div className=' absolute md:right-52 top-[120px] md:top-[90px] p-1 border-black'>
                <label htmlFor="searh" className='mr-2 md:text-xl '>Search</label>
                <input type="text" id='seach'  value={searchQuery} onChange={handleSearch} className='border-2 border-black pl-1 w-32 md:w-fit'/>
            </div>
            <div className='overflow-auto'>
            <table >
                <thead className=' absolute right-0 top-0 p-1 border-black'>
                </thead>
                <thead>
                    <tr className='bg-gray-400 h-10'>
                        <th className='w-10'>S.No.</th>
                        <th>Id <FaSort  onClick={() => handleSort("_id")}/></th>
                        <th>Image</th>
                        <th>Name <FaSort onClick={() => handleSort('empName')}/></th>
                        <th>Email <FaSort onClick={() => handleSort('email')}/></th>
                        <th>Designation <FaSort onClick={() => handleSort('designation')}/></th>
                        <th>Gender <FaSort onClick={() => handleSort('gender')}/></th>
                        <th>Course <FaSort onClick={() => handleSort('course')}/></th>
                        <th>Date <FaSort onClick={() => handleSort('date')}/></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { currentEmps.map((employee, index) => (
                        <tr key={employee._id}>
                            <td>{indexOfFirstEmp+index + 1}</td>
                            <td>{employee._id}</td>
                            <td><img src={employee.img} alt="Profile" width={40} height={40} /></td>
                            <td>{employee.empName}</td>
                            <td><Link to={`mailto:${employee.email}`} className='text-blue-400'>{employee.email}</Link></td>
                            <td>{employee.designation}</td>
                            <td>{employee.gender}</td>
                            <td>{employee.course}</td>
                            <td>{employee.date}</td>
                            <td className=''>
                                {/* Placeholder for actions */}
                                <div className='flex'>
                                <button type='button'><Link to={`/edit/employee/${employee._id}`} className='bg-gray-600 text-blue-400 hover:bg-white font-bold border-2 p-2 rounded shadow-2xl hover:text-green-600'>Edit</Link></button>&nbsp;
                                <button type='button' onClick={(event) => handleDeleteEmployee(event,employee._id,employee.empName)} className='bg-gray-600 text-blue-400 hover:bg-white font-bold border-2 p-2 rounded shadow-2xl hover:text-red-600'>Delete</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            
        </div>
                {/* Pagination buttons at the bottom */}
                <div className={`flex justify-around  mt-8 w-full ${ filteredData.length>5 ? "block" : "hidden"}`}>
                <div>
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white mr-2"
                >
                    Previous
                </button>
                </div>
                <div>
                {getPageNumbers().map((number) => (
                    <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 rounded-full ${
                        currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    } mr-2`}
                    >
                    {number}
                    </button>
                ))}
                </div>
                <div>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 rounded-full bg-blue-500 text-white ml-2"
                >
                    Next
                </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeTable;
