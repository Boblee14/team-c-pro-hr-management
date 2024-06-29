import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './salaryCalculation.css';

const SalarySlipGeneration = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
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

  const handleGenerateSalarySlip = async (e) => {
    e.preventDefault();

    if (!selectedEmployee || !month || !year) {
      setMessage('Please select an employee and provide month and year');
      return;
    }

    const monthName = getMonthName(month);

    try {
      const response = await axios.get(`http://localhost:5001/api/generate-salary-slip/${selectedEmployee}`, {
        params: { month, year },
        responseType: 'blob' 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Salary_Slip_${selectedEmployee}_${monthName}_${year}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('Salary slip generated successfully');
    } catch (error) {
      setMessage('Error generating salary slip');
      console.error(error);
    }
  };

  const getMonthName = (monthNumber) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  };

  return (
    <div className="salary-calculation">
      <h2>Generate Salary Slip</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleGenerateSalarySlip}>
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
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          min="2000"
          required
        />
        <button type="submit">Generate Salary Slip</button>
      </form>
    </div>
  );
}

export default SalarySlipGeneration;
