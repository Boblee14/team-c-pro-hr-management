import { CiUser, CiLock } from "react-icons/ci";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import './Login.css';

const Login = () => {
  const [details, setDetails] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState({ type: '', content: '' });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Load remembered username from localStorage
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('username');
    if (rememberedUsername) {
      setDetails(prevDetails => ({ ...prevDetails, username: rememberedUsername }));
      setRememberMe(true);
    }
  }, []);

  const loginSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/login", details);
      login();
      navigate("/dashboard", { state: { id: res.data.result } });
      setMessage({ type: 'success', content: 'Login successful!' });
      if (rememberMe) {
        localStorage.setItem('username', details.username);
      } else {
        localStorage.removeItem('username');
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        content: err.response ? err.response.data.message : "Login failed. Please try again." 
      });
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box login">
        <form onSubmit={loginSubmitHandler}>
          <h1>Login</h1>
          {message.content && (
            <div className={`alert ${message.type}`}>
              {message.content}
            </div>
          )}
          <div className="input-box">
            <input
              type="text"
              placeholder="Enter your username"
              value={details.username}
              onChange={(e) => setDetails({ ...details, username: e.target.value })}
              required
            />
            <CiUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Enter your password"
              value={details.password}
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              required
            />
            <span onClick={() => setPasswordVisible(!passwordVisible)} className="icon password-icon">
              {passwordVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          <div className="Remember-forgot">
            <input 
              type="checkbox" 
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label>Remember</label>
          </div>
          <button type="submit" className="btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
