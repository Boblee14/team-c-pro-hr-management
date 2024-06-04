import { CiUser, CiLock } from "react-icons/ci";
import { Link } from 'react-router-dom';
import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
// import '../Register/Register.css';
import './Login.css'

const Login = () => {
    
    const [details,setdetails]=useState({
        username:"",
        password:""
    })
    const nav = useNavigate()
    const loginSubmitHandler = (e) => {
        // write logic here to submit form to backend.
        e.preventDefault()
        axios.post("http://localhost:5001/api/login",details)
        .then(res=>{alert(res.data.message)
            nav("/dashboard",{state:{id:res.data.result}})
        })
        .catch(err=>alert(err.request.responseText))
    };

    return (
        <div className="wrapper">
            <div className='from-box login'> 
                <form onSubmit={loginSubmitHandler}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your username' onChange={(e)=>setdetails({...details,username:e.target.value})} required />
                        <CiUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="password" 
                        placeholder='Enter your password' onChange={(e)=>setdetails({...details,password:e.target.value})} required />
                        <CiLock className='icon' />
                    </div>

                    
                {/* <div className='register-link'>
                    <Link to="/register">
                        <button type="button">Don&apos;t have an account?</button>
                    </Link>
                </div> */}
                <div className="Remember-forgot">
                    
                    <input type="checkbox" />
                    <label>Remember</label><br>
                    </br>
                    <Link to="/forgot-password">
                        <button type="button">Forgot Password?</button>
                    </Link>
                </div>
                <button type="submit" className="btn">Login</button>
                </form>
            </div>
            
        </div>
    );
}

export default Login;