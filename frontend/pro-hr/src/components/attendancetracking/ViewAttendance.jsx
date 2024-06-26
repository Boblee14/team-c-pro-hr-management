import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './attendanceTracking.css';

const ViewAttendance = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [message, setMessage] = useState('');

  const handleViewDetails = () => {
    if (!selectedDate) {
      setMessage('Please select a date');
      return;
    }

    axios.get(`http://localhost:5001/api/attendance/date/${selectedDate}`)
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
        setAttendanceDetails([]);
      });
  };

  return (
    <div className="attendance-tracking view-attendance">
      <Link to="/dashboard/attendance-tracking" className="back-link">
        <FaArrowLeft className="back-icon" /> Back
      </Link>
      <h2>View Attendance</h2>
      {message && <div className="message">{message}</div>}
      <div className='attendance-head'>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button onClick={handleViewDetails}>View Details</button>
      </div>
      {attendanceDetails && attendanceDetails.length > 0 && (
        <div>
          <h3>Attendance Details for {new Date(selectedDate).toLocaleDateString()}</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceDetails
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(record => (
                  <tr key={record._id}>
                    <td>{record.employeeId}</td>
                    <td>{record.name}</td>
                    <td>{record.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
