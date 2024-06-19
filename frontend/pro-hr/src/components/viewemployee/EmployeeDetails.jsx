import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employeedeatils.css'; 
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  // const [editMode, setEditMode] = useState(false);
  // const [currentEmployee, setCurrentEmployee] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => {
        setEmployees(response.data);
        setMessage(null);
      })
      .catch(error => {
        setMessage('Error fetching employee details');
        setMessageType('error');
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5001/api/employees/${id}`)
      .then(response => {
        setMessage('Employee deleted successfully!');
        setMessageType('success');
        fetchEmployees();
      })
      .catch(error => {
        setMessage('Error deleting employee');
        setMessageType('error');
      });
  };

  const handleUpdate = (employee) => {
    // setEditMode(true);
    // setCurrentEmployee(employee);
    navigate(`/update-employee/${employee._id}`);
  };


  return (
    <div className="employee-details view-employee">
      <h2>Employee Details</h2>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <ul>
        {employees.map(emp => (
          <li key={emp._id} className="employee-card">
            {emp.profilePicture && (
              <img
                src={`../images/${emp.profilePicture}`}
                alt={`${emp.name}'s profile`}
                className="profile-picture"
              />
            )}
            <div className="employee-info">
              <strong>Employee ID:</strong> {emp.employeeId}<br />
              <strong>Name:</strong> {emp.name}<br />
              <strong>Address:</strong> {emp.address}<br />
              <strong>Role:</strong> {emp.role}<br />
              <strong>Salary:</strong> {emp.salary}<br />
              <div className="employee-actions">
                <button className="btn-update" onClick={() => handleUpdate(emp)}>Update</button>
                <button className="btn-delete" onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default EmployeeDetails;
