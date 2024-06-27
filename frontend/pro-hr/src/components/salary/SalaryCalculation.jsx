import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './salaryCalculation.css';

const SalaryCalculation = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [message, setMessage] = useState('');

      
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/employees');
      setEmployees(response.data);
    } catch (error) {
      setMessage('Error fetching employees');
    }
  };

  const handleCalculateSalary = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5001/api//calculate-salary/${selectedEmployee}`,{
        params: { month, year }
      });
      setSalaryDetails(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error calculating salary');
      setSalaryDetails(null);
      console.log(error);
    }
  };
  // console.log(selectedEmployee)
  // console.log(employees)
  return (
    <div className="salary-calculation">
      <h2>Calculate Salary</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleCalculateSalary}>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          required
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp.employeeId}> 
              {emp.name}

            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          min="1"
          max="12"
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2000"
          required
        />
        <button type="submit">Calculate Salary</button>
      </form>

      {salaryDetails && (
        <div className="salary-details">
          <h3>Salary Details</h3>
          <p><strong>Total Salary:</strong> {salaryDetails.totalSalary}</p>
          <p><strong>Base Salary:</strong> {salaryDetails.employeeSalary}</p>
          <p><strong>CL Pay:</strong> {salaryDetails.clPay}</p>
          <p><strong>ML Pay:</strong> {salaryDetails.mlPay}</p>
          <p><strong>Present Days:</strong> {salaryDetails.workingDays}</p>
          <p><strong>CL Days:</strong> {salaryDetails.clDays}</p>
          <p><strong>ML Days:</strong> {salaryDetails.mlDays}</p>
          <p><strong>Total Working Days:</strong> {salaryDetails.totalDays}</p>
        </div>
        
      )}
    </div>
  );
}

export default SalaryCalculation;
