import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './salaryCalculation.css';

const SalarySlipGeneration = ()=>{
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
  
      try {
        const response = await axios.get(`http://localhost:5001/api/generate-salary-slip/${selectedEmployee}`, {
          params: { month, year },
          responseType: 'blob' 
        });
  
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Salary_Slip_${selectedEmployee}_${month}_${year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
  
        setMessage('Salary slip generated successfully');
      } catch (error) {
        setMessage('Error generating salary slip');
        console.error(error);
      }
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
          <button type="submit">Generate Salary Slip</button>
        </form>
      </div>
    );
}

export default SalarySlipGeneration