import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './components.css'; 

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
        console.log(error)
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    axios.put(`http://localhost:5001/api/employees/${id}`, formData)
      .then(response => {
        setMessage('Employee updated successfully!');
        setMessageType('success');
        navigate('/dashboard/employee-details');  
      })
      .catch(error => {
        setMessage('Error updating employee');
        setMessageType('error');
      });
  };

  return (
    <div className="employee-details">
      
      {employee && (
        <form className="addemployee-form" onSubmit={handleSubmit}>
            <h2 className='addemployee-head'>Update Employee</h2>
                {message && (
                    <div className={`message ${messageType}`}>
                    {message}
                    </div>
                )}
          <input className='addemployee-input' type="text" name="employeeId" defaultValue={employee.employeeId} required />
          <input className='addemployee-input' type="text" name="name" defaultValue={employee.name} required />
          <input className='addemployee-input' type="text" name="address" defaultValue={employee.address} required />
          <input className='addemployee-input' type="text" name="role" defaultValue={employee.role} required />
          <input className='addemployee-input' type="number" name="salary" defaultValue={employee.salary} required />
          <input className='addemployee-input' type="file" name="profilePicture" />
          <button className="addemployee-button" type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default UpdateEmployee;
