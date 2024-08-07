import React from 'react';
import { FaUsers, FaClipboardCheck, FaMoneyCheckAlt, FaChartLine } from 'react-icons/fa';
import './dashboard.css';

const Welcome = () => {
  return (
    <div className="welcome">
      <header>
        <h1>Welcome to ProHR</h1>
        <p>Your Complete HR Management Solution</p>
      </header>
      
      <section className="features-overview">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <FaUsers size={50} color="#fe8040" />
            <h3>Employee Management</h3>
            <p>Maintain comprehensive employee records and profiles.</p>
          </div>
          <div className="feature-item">
            <FaClipboardCheck size={50} color="#fe8040" />
            <h3>Attendance Tracking</h3>
            <p>Track employee attendance and leave with ease.</p>
          </div>
          <div className="feature-item">
            <FaMoneyCheckAlt size={50} color="#fe8040" />
            <h3>Payroll Processing</h3>
            <p>Automate payroll calculations and disbursements.</p>
          </div>
          <div className="feature-item">
            <FaChartLine size={50} color="#fe8040" />
            <h3>Reporting</h3>
            <p>Generate detailed reports and insights.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;
