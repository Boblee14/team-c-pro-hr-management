// Dashboard.jsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import './dashboard.css';

const navItems = [
  { path: '', label: 'Home', icon: <HomeIcon /> },
  { path: 'add-employee', label: 'Add Employee', icon: <PersonAddIcon /> },
  { path: 'employee-details', label: 'View Employee Details', icon: <ListIcon /> },
  { path: 'attendance-tracking', label: 'Attendance Tracking', icon: <AccessTimeIcon /> },
  { path: 'salary-calculation', label: 'Salary Calculation', icon: <AttachMoneyIcon /> },
  { path: 'salary-slip-generation', label: 'Salary Slip Generation', icon: <ReceiptIcon /> },
];

const Dashboard = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleNav = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="dashboard">
      <nav className={`dashboard-nav ${expanded ? 'expanded' : ''}`}>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link to={item.path} data-tooltip={item.label}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
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
