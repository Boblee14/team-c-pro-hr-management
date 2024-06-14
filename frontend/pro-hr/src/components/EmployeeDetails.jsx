import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './components.css'; 

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); 

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
    setEditMode(true);
    setCurrentEmployee(employee);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = currentEmployee._id;

    axios.put(`http://localhost:5001/api/employees/${id}`, formData)
      .then(response => {
        setMessage('Employee updated successfully!');
        setMessageType('success');
        setEditMode(false);
        setCurrentEmployee(null);
        fetchEmployees();
      })
      .catch(error => {
        setMessage('Error updating employee');
        setMessageType('error');
      });
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

      {editMode && (
        <form onSubmit={handleSubmit}>
          <h3>Update Employee</h3>
          <input type="text" name="employeeId" defaultValue={currentEmployee.employeeId} required />
          <input type="text" name="name" defaultValue={currentEmployee.name} required />
          <input type="text" name="address" defaultValue={currentEmployee.address} required />
          <input type="text" name="role" defaultValue={currentEmployee.role} required />
          <input type="number" name="salary" defaultValue={currentEmployee.salary} required />
          <input type="file" name="profilePicture" />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default EmployeeDetails;
