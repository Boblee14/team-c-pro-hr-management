import { CiUser, CiLock } from "react-icons/ci";
import { Link } from 'react-router-dom';
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Login.css';

const Login = () => {
  const [details, setDetails] = useState({
    username: "",
    password: ""
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/login", details);
      login();
      navigate("/dashboard", { state: { id: res.data.result } });
    } catch (err) {
      alert(err.response ? err.response.data.message : "Login failed. Please try again.");
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={loginSubmitHandler}>
          <h1>Login</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter your username"
              onChange={(e) => setDetails({ ...details, username: e.target.value })}
              required
            />
            <CiUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              required
            />
            <CiLock className="icon" />
          </div>
          <div className="Remember-forgot">
            <input type="checkbox" />
            <label>Remember</label>
            <Link to="/forgot-password">
              <button type="button">Forgot Password?</button>
            </Link>
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
