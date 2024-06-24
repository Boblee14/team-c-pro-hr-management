import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { FaArrowLeft } from 'react-icons/fa';
import './salaryCalculation.css';

const CalculateSalary = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => {
        setEmployees(response.data);
        if (response.data.length > 0) {
          setEmployeeId(response.data[0].employeeId);
        }
      })
      .catch(error => {
        setMessage('Error fetching employees');
      });
  };

  const handleCalculateSalary = () => {
    axios.get(`http://localhost:5001/api/calculate-salary/${employeeId}`)
      .then(response => {
        setSalaryDetails(response.data.salaryInfo);
        setMessage('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
          setMessage(error.response.data.error);
        } else {
          setMessage('Error calculating salary');
        }
        setSalaryDetails(null);
      });
  };

  return (
    <div className="salary-calculation">
      <h2>Calculate Salary</h2>
      {message && <div className="message">{message}</div>}
      <div className="salary-head ">
        <select
          className="salary-placeholder"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          {employees.map(emp => (
            <option key={emp._id} value={emp.employeeId}>
              {emp.name}
            </option>
          ))}
        </select>
        <button onClick={handleCalculateSalary}>Calculate Salary</button>
      </div>
      {salaryDetails && (
        <div>
          <h3>Salary Details for Employee ID: {employeeId}</h3>
          <table className="salary-table">
            <tbody>
              <tr>
                <td>Present Days</td>
                <td>{salaryDetails.presentDays}</td>
              </tr>
              <tr>
                <td>Casual Leave Days</td>
                <td>{salaryDetails.clDays}</td>
              </tr>
              <tr>
                <td>Medical Leave Days</td>
                <td>{salaryDetails.mlDays}</td>
              </tr>
              <tr>
                <td>Absent Days</td>
                <td>{salaryDetails.absentDays}</td>
              </tr>
              <tr>
                <td>Total Salary</td>
                <td>{salaryDetails.totalSalary}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CalculateSalary;
