import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components.css';

const EmployeeDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    address: '',
    role: '',
    proofType: '',
    proofFile: null,
    profilePicture: null
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => setEmployees(response.data))
      .catch(error => alert('Error fetching employee details'));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEmployee({ ...newEmployee, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newEmployee.name);
    formData.append('address', newEmployee.address);
    formData.append('role', newEmployee.role);
    formData.append('salary', newEmployee.salary);
    formData.append('proofType', newEmployee.proofType);
    formData.append('proofFile', newEmployee.proofFile);
    formData.append('profilePicture', newEmployee.profilePicture);

    axios.post('http://localhost:5001/api/employees', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      alert('Employee added successfully!');
      fetchEmployees();
      setNewEmployee({
        name: '',
        address: '',
        role: '',
        salary:'',
        proofType: '',
        proofFile: null,
        profilePicture: null
      });
    })
    .catch(error => alert('Error adding employee'));
  };

  return (
    <div className="employee-details">
      <ul>
        {employees.map(emp => (
          <li key={emp.id}>
            <img src={emp.profilePicture} alt={`${emp.name}'s profile`} className="profile-picture" />
            <div>
              <strong>Name:</strong> {emp.name}<br />
              <strong>Address:</strong> {emp.address}<br />
              <strong>Role:</strong> {emp.role}<br />
              <strong>Salary:</strong> {emp.salary}<br />
              <strong>Proof:</strong> {emp.proofType}<br />
            </div>
          </li>
        ))}
      </ul>
      <form className="addemployee-form" onSubmit={handleSubmit}>
        <h2 className='addemployee-head'>Add Employee</h2>
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
        <select 
          className='addemployee-input'
          name="proofType" 
          value={newEmployee.proofType} 
          onChange={handleInputChange} 
          required
        >
          <option value="" disabled>Select Proof Type</option>
          <option value="Aadhar">Aadhar</option>
          <option value="PAN">PAN</option>
          <option value="Driving License">Driving License</option>
        </select>
        <input 
          className='addemployee-input'
          type="file" 
          name="proofFile" 
          accept=".pdf,.jpg,.jpeg,.png" 
          onChange={handleFileChange} 
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
