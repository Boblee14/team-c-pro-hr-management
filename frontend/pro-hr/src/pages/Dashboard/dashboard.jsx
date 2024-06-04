// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './dashboard.css';

const navItems = [
  { path: 'add-employee', label: 'Add Employee' },
  { path: 'employee-details', label: 'View Employee Details' },
  { path: 'attendance-tracking', label: 'Attendance Tracking' },
  { path: 'salary-calculation', label: 'Salary Calculation' },
  { path: 'salary-slip-generation', label: 'Salary Slip Generation' },
];

const Dashboard = () => {
  
  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
