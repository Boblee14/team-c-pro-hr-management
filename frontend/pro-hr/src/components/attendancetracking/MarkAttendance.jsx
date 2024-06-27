import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './attendanceTracking.css';

const MarkAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [date, setDate] = useState('');
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/employees');
      setEmployees(response.data);
    } catch (error) {
      setMessage('Error fetching employees');
    }
  };

  const handleAttendanceChange = (employeeId, field, value) => {
    setAttendance((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value,
      },
    }));
  };

  const handleRecordAttendance = async (e) => {
    e.preventDefault();
    const records = employees.map((employee) => ({
      employeeId: employee.employeeId,
      date,
      status: attendance[employee.employeeId]?.status || 'Absent',
      leaveType: attendance[employee.employeeId]?.status === 'Absent' ? (attendance[employee.employeeId]?.leaveType || 'CL') : null,
    }));
    console.log(records)

    try {
      await axios.post('http://localhost:5001/api/attendance/record', { records });
      setMessage('Attendance recorded successfully!');
    } catch (error) {
      setMessage('Error recording attendance');
      console.log(error);
    }
  };

  return (
    <div className="attendance-tracking">
      <Link to="/dashboard/attendance-tracking" className="back-link">
        <FaArrowLeft className="back-icon" /> Back
      </Link>
      <h2>Mark Attendance</h2>
      {message && <div className="message">{message}</div>}
      <form onSubmit={handleRecordAttendance}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Casual Leave</th>
              <th>Medical Leave</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.employeeId}</td>
                <td>{employee.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[employee.employeeId]?.status === 'Present'}
                    onChange={() =>
                      handleAttendanceChange(employee.employeeId, 'status', 'Present')
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={attendance[employee.employeeId]?.status === 'Absent'}
                    onChange={() =>
                      handleAttendanceChange(employee.employeeId, 'status', 'Absent')
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    disabled={attendance[employee.employeeId]?.status !== 'Absent'}
                    checked={attendance[employee.employeeId]?.leaveType === 'CL'}
                    onChange={() =>
                      handleAttendanceChange(employee.employeeId, 'leaveType', 'CL')
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    disabled={attendance[employee.employeeId]?.status !== 'Absent'}
                    checked={attendance[employee.employeeId]?.leaveType === 'ML'}
                    onChange={() =>
                      handleAttendanceChange(employee.employeeId, 'leaveType', 'ML')
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="button-group">
          <button type="submit">Record Attendance</button>
        </div>
      </form>
    </div>
  );
};

export default MarkAttendance;
