import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import Navbar from './components/navbar/Navbar';
import Dashboard from './pages/Dashboard/dashboard';
import AddEmployee from './components/addemployee/AddEmployee';
import EmployeeDetails from './components/viewemployee/EmployeeDetails';
import AttendanceTracking from './components/attendancetrancking/AttendanceTracking';
import SalaryCalculation from './components/salary/SalaryCalculation';
// import SalarySlipGeneration from './components/SalarySlipGeneration';
import Welcome from './pages/Dashboard/welcome';
import { AuthProvider } from './context/AuthContext';
import UpdateEmployee from './components/viewemployee/UpdateEmployee';
import MarkAttendance from './components/attendancetrancking/MarkAttendance'; // Import MarkAttendance component
import ViewAttendance from './components/attendancetrancking/ViewAttendance'; // Import ViewAttendance component

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="" element={<Welcome />} />
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employee-details" element={<EmployeeDetails />} />
          <Route path="attendance-tracking" element={<AttendanceTracking />} />
          <Route path="salary-calculation" element={<SalaryCalculation />} />
          {/* <Route path="salary-slip-generation" ele  ment={<SalarySlipGeneration />} /> */}
        </Route>
        <Route path="/update-employee/:id" element={<UpdateEmployee />} />
        <Route path="/mark-attendance" element={<MarkAttendance />} /> {/* Add route for Mark Attendance */}
        <Route path="/view-attendance" element={<ViewAttendance />} /> {/* Add route for View Attendance */}
      </Routes>
    </AuthProvider>
  );
}

export default App;
