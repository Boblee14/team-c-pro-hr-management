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
      const response = await axios.get(`http://localhost:5001/api/calculate-salary/${selectedEmployee}`, {
        params: { month: getMonthNumber(month), year }
      });
      setSalaryDetails(response.data);
      setMessage('');
    } catch (error) {
      setMessage('Error calculating salary');
      setSalaryDetails(null);
      console.log(error);
    }
  };

  // Function to convert month name to number
  const getMonthNumber = (monthName) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return monthNames.indexOf(monthName) + 1;
  };

  // Options for month dropdown
  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          required
        >
          <option value="">Select Month</option>
          {monthOptions.map((monthName, index) => (
            <option key={index} value={monthName}>
              {monthName}
            </option>
          ))}
        </select>
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
          <table className="salary-table">
            <tbody>
              <tr>
                <td><strong>Base Salary:</strong></td>
                <td>{salaryDetails.employeeSalary}</td>
              </tr>
              <tr>
                <td><strong>Present Days:</strong></td>
                <td>{salaryDetails.workingDays}</td>
              </tr>
              <tr>
                <td><strong>CL Days:</strong></td>
                <td>{salaryDetails.clDays}</td>
              </tr>
              <tr>
                <td><strong>ML Days:</strong></td>
                <td>{salaryDetails.mlDays}</td>
              </tr>
              <tr>
                <td><strong>Excess CL Payoff:</strong></td>
                <td>{salaryDetails.excessCLPayoff}</td>
              </tr>
              <tr>
                <td><strong>Excess ML Payoff:</strong></td>
                <td>{salaryDetails.excessMLPayoff}</td>
              </tr>
              <tr>
                <td><strong>Total Salary:</strong></td>
                <td>{salaryDetails.totalSalary}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SalaryCalculation;
