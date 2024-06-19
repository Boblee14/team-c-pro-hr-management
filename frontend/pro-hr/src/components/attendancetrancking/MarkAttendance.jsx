import React, { useState } from 'react';
import axios from 'axios';
import './attendanceTracking.css';

const MarkAttendance = () => {
  const [newRecord, setNewRecord] = useState({
    employeeId: '',
    date: '',
    status: '',
    leaveType: ''
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/attendance', newRecord);
      setMessage('Attendance record added successfully!');
      setMessageType('success');
      setNewRecord({
        employeeId: '',
        date: '',
        status: '',
        leaveType: ''
      });
    } catch (error) {
      setMessage('Error adding attendance record');
      setMessageType('error');
    }
  };

  return (
    <div className="mark-attendance">
      <h3>Mark Attendance</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      <form className="attendance-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="employeeId" 
          placeholder="Employee ID" 
          value={newRecord.employeeId} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="date" 
          name="date" 
          value={newRecord.date} 
          onChange={handleInputChange} 
          required 
        />
        <select 
          name="status" 
          value={newRecord.status} 
          onChange={handleInputChange} 
          required
        >
          <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        {newRecord.status === 'Absent' && (
          <select 
            name="leaveType" 
            value={newRecord.leaveType} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select Leave Type</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Medical Leave">Medical Leave</option>
          </select>
        )}
        <button type="submit">Add Record</button>
      </form>
    </div>
  );
};

export default MarkAttendance;
