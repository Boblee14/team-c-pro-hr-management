import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './attendanceTracking.css';

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
  const [leaveType, setLeaveType] = useState('CL');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => {
        setMessage('Error fetching employees');
      });
  };

  const handleRecordAttendance = (e) => {
    e.preventDefault();
    const attendanceStatus = status === 'Absent' ? leaveType : status;

    axios.post('http://localhost:5001/api/attendance/record', {
      employeeId: selectedEmployee,
      date,
      status:attendanceStatus,
    })
      .then(response => {
        setMessage('Attendance recorded successfully!');
      })
      .catch(error => {
        setMessage('Error recording attendance');
        console.log(error)
      });
  };

  console.log(status)

  return (
    <div className="attendance-tracking">
      <Link to="/dashboard/attendance-tracking" className="back-link">
        <FaArrowLeft className="back-icon" /> Back
      </Link>
      <h2>Mark Attendance</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleRecordAttendance}>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp.employeeId}>
              {emp.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>

        </select>
        {status === 'Absent' && (
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="CL">Casual Leave</option>
            <option value="ML">Medical Leave</option>
          </select>
        )}
        <div className="button-group">
          <button type="submit">Record Attendance</button>  
        </div>
      </form>
    </div>
  );
};

export default MarkAttendance;
