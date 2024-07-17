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
      console.error('Error fetching employees:', error);
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
      console.error('Error generating salary slip:', error);
      setMessage('Error generating salary slip');
    }
  };

  const getMonthName = (monthNumber) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return monthNames[monthNumber - 1];
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2000;
  const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, index) => startYear + index);

  return (
    <div className="salary-calculation">
      <h2>Generate Salary Slip</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleGenerateSalarySlip}>
        <div className="salary-calc-head">
          <select
            className="salary-calc-placeholder"
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
            className="salary-calc-placeholder"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          >
            <option value="">Select Month</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{getMonthName(m)}</option>
            ))}
          </select>
          <select
            className="salary-calc-placeholder"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          >
            <option value="">Select Year</option>
            {yearOptions.map((yearOption) => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Generate Salary Slip</button>
      </form>
    </div>
  );
}

export default SalarySlipGeneration;
