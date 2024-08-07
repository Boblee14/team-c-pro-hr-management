import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './employeedetails.css'; 

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = () => {
    axios.get(`http://localhost:5001/api/employees/${id}`)
      .then(response => {
        setEmployee(response.data);
        setMessage(null);
      })
      .catch(error => {
        setMessage('Error fetching employee details');
        setMessageType('error');
        console.log(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    axios.put(`http://localhost:5001/api/employees/${id}`, formData)
      .then(response => {
        setMessage('Employee updated successfully!');
        setMessageType('success');
      })
      .catch(error => {
        setMessage('Error updating employee');
        setMessageType('error');
      });
  };

  const handleCancel = () => {
    navigate('/dashboard/employee-details');
  };

  return (
    <div className="employee-details">
      {employee && (
        <form className="updemployee-form" onSubmit={handleSubmit}>
          <Link to="/dashboard/employee-details" className="back-link">
            <FaArrowLeft className="back-icon" /> Back
          </Link>
          <h2 className="updemployee-head">Update Employee</h2>
          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
          <div className="input-group">
            <label className="updemployee-label">Employee ID</label>
            <input className="updemployee-input" type="text" name="employeeId" defaultValue={employee.employeeId} required />
          </div>
          <div className="input-group">
            <label className="updemployee-label">Name</label>
            <input className="updemployee-input" type="text" name="name" defaultValue={employee.name} required />
          </div>
          <div className="input-group">
            <label className="updemployee-label">Address</label>
            <input className="updemployee-input" type="text" name="address" defaultValue={employee.address} required />
          </div>
          <div className="input-group">
            <label className="updemployee-label">Role</label>
            <input className="updemployee-input" type="text" name="role" defaultValue={employee.role} required />
          </div>
          <div className="input-group">
            <label className="updemployee-label">Salary Per Month</label>
            <input className="updemployee-input" type="number" name="salary" defaultValue={employee.salary} required />
          </div>
          <div className="input-group">
            <label className="updemployee-label">Profile Picture</label>
            <input className="updemployee-input" type="file" name="profilePicture" />
          </div>
          <div className="button-container">
            <button className="updemployee-button" type="submit">Update</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateEmployee;