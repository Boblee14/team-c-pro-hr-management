import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './attendanceTracking.css';

const ViewAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/attendance');
      setAttendanceRecords(response.data);
      setLoading(false);
    } catch (error) {
      setMessage('Error fetching attendance records');
      setMessageType('error');
      setLoading(false);
    }
  };

  const handleEmployeeClick = (employeeId) => {
    setSelectedEmployee(employeeId);
  };

  const getEmployeeProfile = (employeeId) => {
    const records = attendanceRecords.filter(record => record.employeeId === employeeId);
    const workingDays = records.filter(record => record.status === 'Present').length;
    const casualLeaves = records.filter(record => record.leaveType === 'Casual Leave').length;
    const medicalLeaves = records.filter(record => record.leaveType === 'Medical Leave').length;

    return {
      workingDays,
      casualLeaves,
      medicalLeaves,
    };
  };

  return (
    <div className="view-attendance">
      <h3>View Attendance Details</h3>
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="attendance-list">
          {attendanceRecords.map(record => (
            <li 
              key={record._id} 
              className="attendance-item"
              onClick={() => handleEmployeeClick(record.employeeId)}
            >
              <strong>Employee ID:</strong> {record.employeeId}<br />
              <strong>Date:</strong> {new Date(record.date).toLocaleDateString()}<br />
              <strong>Status:</strong> {record.status}<br />
              {record.status === 'Absent' && (
                <>
                  <strong>Leave Type:</strong> {record.leaveType}<br />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      {selectedEmployee && (
        <div className="employee-profile">
          <h3>Employee Profile: {selectedEmployee}</h3>
          {(() => {
            const { workingDays, casualLeaves, medicalLeaves } = getEmployeeProfile(selectedEmployee);
            return (
              <div>
                <p><strong>Working Days:</strong> {workingDays}</p>
                <p><strong>Casual Leaves:</strong> {casualLeaves}</p>
                <p><strong>Medical Leaves:</strong> {medicalLeaves}</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
