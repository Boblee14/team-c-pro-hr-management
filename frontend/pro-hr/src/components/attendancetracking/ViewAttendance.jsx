import React, { useState } from 'react';
import axios from 'axios';


const ViewAttendance = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [message, setMessage] = useState('');

  const handleViewDetails = () => {
    axios.get(`http://localhost:5001/api/attendance/${employeeId}`)
      .then(response => {
        setAttendanceDetails(response.data);
        setMessage('');
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.error) {
            setMessage(error.response.data.error);
          } else {
            setMessage('Error fetching attendance records');
          }
          setAttendanceRecords([]);
      });
  };

  return (
    <div className="view-attendance">
      <h2>View Attendance</h2>
      {message && <div className="message">{message}</div>}
      <div>
        <input
          type="text"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
          placeholder="Enter Employee ID"
        />
        <button onClick={handleViewDetails}>View Details</button>
      </div>
      {attendanceDetails && (
        <div>
          <h3>Attendance Details for Employee ID: {attendanceDetails[0]?.employeeId}</h3>
          <ul>
            {attendanceDetails
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(record => (
              <li key={record._id}>
                Date: {new Date(record.date).toLocaleDateString()}, Status: {record.status}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
