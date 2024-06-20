import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './attendanceTracking.css'

const AttendanceTracking = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('Present');
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

  const fetchAttendanceRecords = (employeeId) => {
    axios.get(`http://localhost:5001/api/attendance/${employeeId}`)
      .then(response => {
        setAttendanceRecords(response.data);
      })
      .catch(error => {
        setMessage('Error fetching attendance records');
      });
  };

  const handleRecordAttendance = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/attendance/record', {
      employeeId: selectedEmployee,
      date,
      status,
    })
      .then(response => {
        setMessage('Attendance recorded successfully!');
        // fetchAttendanceRecords(selectedEmployee);
      })
      .catch(error => {
        setMessage('Error recording attendance');
      });
  };

  return (
    <div className="attendance-tracking">
      <h2>Attendance Tracking</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleRecordAttendance}>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>
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
          <option value="CL">Casual Leave</option>
          <option value="ML">Medical Leave</option>
        </select>
        <button  type="submit">Record Attendance</button>
      </form>

      {/* {selectedEmployee && (
        <div>
          <h3>Attendance Records</h3>
          <ul>
            {attendanceRecords.map(record => (
              <li key={record._id}>
                {record.date}: {record.status}
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
};

export default AttendanceTracking;
