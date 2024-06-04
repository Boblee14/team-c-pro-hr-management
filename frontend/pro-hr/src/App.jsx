import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login/Login';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard/dashboard';
import AddEmployee from './components/AddEmployee';
import EmployeeDetails from './components/EmployeeDetails';
// import AttendanceTracking from './components/AttendanceTracking';
// import SalaryCalculation from './components/SalaryCalculation';
// import SalarySlipGeneration from './components/SalarySlipGeneration';

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="add-employee" element={<AddEmployee />} />
          <Route path="employee-details" element={<EmployeeDetails />} />
          {/* <Route path="attendance-tracking" element={<AttendanceTracking />} />
          <Route path="salary-calculation" element={<SalaryCalculation />} />
          <Route path="salary-slip-generation" element={<SalarySlipGeneration />} /> */}
        </Route>
      </Routes>   
    </>
  )
}

export default App
