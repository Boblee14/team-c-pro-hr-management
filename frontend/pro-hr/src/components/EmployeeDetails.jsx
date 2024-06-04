import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => alert('Error fetching employee details'));
  }, []);

  return (
    <div>
      <h2>Employee Details</h2>
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>{emp.name} - {emp.position} - {emp.salary}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDetails;
