import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './attendanceTracking.css';

const ViewAttendance = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [attendanceDetails, setAttendanceDetails] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    axios.get('http://localhost:5001/api/employees')
      .then(response => {
        setEmployees(response.data);
        if (response.data.length > 0) {
          setEmployeeId(response.data[0].employeeId); // Set the first employee ID as the default selected value
        }
      })
      .catch(error => {
        setMessage('Error fetching employees');
      });
  };

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
        <select
          className='attendance-placeholder'
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        >
          {employees.map(emp => (
            <option key={emp._id} value={emp.employeeId}>
              {emp.name}
            </option>
          ))}
        </select>
        <button  onClick={handleViewDetails}>View Details</button>
      </div>
      {attendanceDetails && attendanceDetails.length > 0 && (
        <div>
          <h3>Attendance Details for Employee ID: {attendanceDetails[0]?.employeeId}</h3>
          <table className="attendance-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceDetails
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map(record => (
                  <tr key={record._id}>
                    <td>{new Date(record.date).toLocaleDateString()}</td>
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
