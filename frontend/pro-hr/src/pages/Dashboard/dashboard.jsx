import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="add-employee">Add Employee</Link></li>
          <li><Link to="employee-details">View Employee Details</Link></li>
          <li><Link to="attendance-tracking">Attendance Tracking</Link></li>
          <li><Link to="salary-calculation">Salary Calculation</Link></li>
          <li><Link to="salary-slip-generation">Salary Slip Generation</Link></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
