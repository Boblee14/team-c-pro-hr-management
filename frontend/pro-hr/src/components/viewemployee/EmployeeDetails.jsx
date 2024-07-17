import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './employeedetails.css';
import { useNavigate } from 'react-router-dom';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
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

  const handleDelete = (employee) => {
    setSelectedEmployee(employee);
    setConfirmingDelete(true);
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:5001/api/employees/${selectedEmployee._id}`)
      .then(response => {
        setMessage('Employee deleted successfully!');
        setMessageType('success');
        setConfirmingDelete(false);
        fetchEmployees();
      })
      .catch(error => {
        setMessage('Error deleting employee');
        setMessageType('error');
        setConfirmingDelete(false);
      });
  };

  const cancelDelete = () => {
    setSelectedEmployee(null);
    setConfirmingDelete(false);
  };

  const handleUpdate = (employee) => {
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
      <ul className="employee-list">
        {employees.map(emp => (
          <li key={emp._id} className="employee-card">
            <div className="employee-info">
              {emp.profilePicture && (
                <img
                  src={`../images/${emp.profilePicture}`}
                  alt={`${emp.name}'s profile`}
                  className="profile-picture"
                />
              )}
              <table>
                <tbody>
                  <tr>
                    <th><strong>Employee ID:</strong></th>
                    <td>{emp.employeeId}</td>
                  </tr>
                  <tr>
                    <th><strong>Name:</strong></th>
                    <td>{emp.name}</td>
                  </tr>
                  <tr>
                    <th><strong>Address:</strong></th>
                    <td>{emp.address}</td>
                  </tr>
                  <tr>
                    <th><strong>Role:</strong></th>
                    <td>{emp.role}</td>
                  </tr>
                  <tr>
                    <th><strong>Salary:</strong></th>
                    <td>{emp.salary}</td>
                  </tr>
                </tbody>
              </table>
              <div className="employee-actions">
                <button className="btn-update" onClick={() => handleUpdate(emp)}>Update</button>
                <button className="btn-delete" onClick={() => handleDelete(emp)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {confirmingDelete && selectedEmployee && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to delete {selectedEmployee.name}?</p>
            <div className="popup-buttons">
              <button className="btn-confirm" onClick={confirmDelete}>Yes</button>
              <button className="btn-cancel" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetails;
