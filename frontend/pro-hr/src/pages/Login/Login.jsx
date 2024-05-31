import { CiUser, CiLock } from "react-icons/ci";
import { Link } from 'react-router-dom';
import '../Register/Register.css';

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

                    <button type="submit">Login</button>
                </form>

                <div className='register-link'>
                    <Link to="/register">
                        <button type="button">Don&apos;t have an account?</button>
                    </Link>
                </div>
                <div className="Remember-forgot">
                    <label>Remember</label>
                    <input type="checkbox" />
                    <Link to="/forgot-password">
                        <button type="button">Forgot Password?</button>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default Login;