import React, { useState } from 'react';
import axios from 'axios';

const SalaryCalculation = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [salaryDetails, setSalaryDetails] = useState(null);
  const [message, setMessage] = useState('');

  const handleCalculateSalary = () => {
    axios.get(`http://localhost:5001/api/attendance/calculate-salary/${employeeId}`)
      .then(response => {
        setSalaryDetails(response.data);
        setMessage('');
      })
      .catch(error => {
        setMessage('Error calculating salary');
        setSalaryDetails(null);
        console.log(error)
      });
  };

  return (
    <div className="salary-calculation">
      <h2>Calculate Salary</h2>
      {message && <div className="message">{message}</div>}
      <div>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
        />
        <button onClick={handleCalculateSalary}>Calculate Salary</button>
      </div>
      {salaryDetails && (
        <div>
          <h3>Salary Details for Employee ID: {salaryDetails.employeeId}</h3>
          <p>Working Days: {salaryDetails.workingDays}</p>
          <p>Casual Leave Days: {salaryDetails.clDays}</p>
          <p>Medical Leave Days: {salaryDetails.mlDays}</p>
          <p>Absent Days: {salaryDetails.absentDays}</p>
          <p>Total Paid Days: {salaryDetails.totalPaidDays}</p>
          <p>Total Unpaid Days: {salaryDetails.totalUnpaidDays}</p>
          <p><strong>Total Salary: ${salaryDetails.totalSalary.toFixed(2)}</strong></p>
        </div>
      )}
    </div>
  );
};

export default SalaryCalculation;
