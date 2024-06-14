import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components.css';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    employeeId: '',
    name: '',
    address: '',
    role: '',
    salary: '',
    profilePicture: null
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); 
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => {
        setMessage('Error fetching employee details');
        setMessageType('error');
      });
  }; 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEmployee({ ...newEmployee, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const employeeExists = employees.some(emp => emp.employeeId === newEmployee.employeeId);
    if (employeeExists) {
      setMessage('Employee ID already exists. Please choose a unique ID.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('employeeId', newEmployee.employeeId);
    formData.append('name', newEmployee.name);
    formData.append('address', newEmployee.address);
    formData.append('role', newEmployee.role);
    formData.append('salary', newEmployee.salary);
    formData.append('profilePicture', newEmployee.profilePicture);

    axios.post('http://localhost:5001/api/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      setMessage('Employee added successfully!');
      setMessageType('success');
      fetchEmployees();
      setNewEmployee({
        employeeId: '',
        name: '',
        address: '',
        role: '',
        salary: '',
        profilePicture: null
      });
    })
    .catch(error => {
      setMessage('Error in adding employee');
      setMessageType('error');
    });
  };

  return (
    <div className="employee-details">
      <form className="addemployee-form" onSubmit={handleSubmit}>
        <h2 className='addemployee-head'>Add Employee</h2>
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}
        <input 
          className='addemployee-input'
          type="text" 
          name="employeeId" 
          placeholder="Employee ID" 
          value={newEmployee.employeeId} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          className='addemployee-input'
          type="text" 
          name="name" 
          placeholder="Name" 
          value={newEmployee.name} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          className='addemployee-input'
          type="text" 
          name="address" 
          placeholder="Address" 
          value={newEmployee.address} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          className='addemployee-input'
          type="text" 
          name="role" 
          placeholder="Role" 
          value={newEmployee.role} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          className='addemployee-input'
          type="number" 
          name="salary" 
          placeholder="Salary" 
          value={newEmployee.salary} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          className='addemployee-input'
          type="file" 
          name="profilePicture" 
          accept="image/*" 
          onChange={handleFileChange} 
          required 
        />
        <button className="addemployee-button" type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default EmployeeDetails;
