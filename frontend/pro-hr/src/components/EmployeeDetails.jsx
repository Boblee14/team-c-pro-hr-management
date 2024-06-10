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
          <li key={emp.id}>
          {emp.profilePicture && (
              <img
                src={`../images/${emp.profilePicture}`}
                alt={`${emp.name}'s profile`}
                className="profile-picture"
              />
            )}  
           
            <div>
              <strong>Employee ID:</strong> {emp.employeeId}<br />
              <strong>Name:</strong> {emp.name}<br />
              <strong>Address:</strong> {emp.address}<br />
              <strong>Role:</strong> {emp.role}<br />
              <strong>Salary:</strong> {emp.salary}<br />
              {/* <strong>Proof:</strong> {emp.proofType}<br /> */}
            </div>
          </li>
        ))}
      </ul>
      
    </div>
  );
};

export default EmployeeDetails;
