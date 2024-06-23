  import React from 'react';
  import { Link } from 'react-router-dom';
  import './attendanceTracking.css';

  const AttendanceTracking = () => {
    return (
      <div className="attendance">
        <h2>Attendance Tracking</h2>
        <div className="card-container">
          <Link to="/mark-attendance" className="card">
            <h3>Mark Attendance</h3>
          </Link>
          <Link to="/view-attendance" className="card">
            <h3>View Attendance Details</h3>
          </Link>
        </div>
      </div>
    );
  };

  export default AttendanceTracking;
