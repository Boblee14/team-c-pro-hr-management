import { CiUser, CiLock } from "react-icons/ci";
import { Link } from 'react-router-dom';
// import '../Register/Register.css';
import './Login.css'

const Login = () => {
    


    const loginSubmitHandler = () => {
        // write logic here to submit form to backend.
    };

    return (
        <div className="wrapper">
            <div className='from-box login'> 
                <form onSubmit={loginSubmitHandler}>
                    <h1>Login</h1>
                    <div className='input-box'>
                        <input type="text" placeholder='Enter your username' required />
                        <CiUser className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="password" 
                        placeholder='Enter your password' required />
                        <CiLock className='icon' />
                    </div>

                    
                </form>

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
            </div>
            
        </div>
    );
}

export default Login;