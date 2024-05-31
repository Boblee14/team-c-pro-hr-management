import { CiUser, CiLock } from "react-icons/ci";
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Register = () => {
   
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the form submission logic here
    
  };

  return (
    <div className="wrapper">
      <div className='form-box register'>
        <form onSubmit={handleSubmit}>
          <h1>Registration</h1>
          
          <div className='input-box'>
            <input type="text" placeholder='Enter your username' required />
            <CiUser className='icon' />
          </div>
          
          <div className='input-box'>
            <input type="email" placeholder='Enter your email' required />
            <MdEmail className='icon' />
          </div>
          
          <div className='input-box'>
            <input type="password" placeholder='Enter your password' required />
            <CiLock className='icon' />
          </div>
          
          <div className="Remember-forgot">
            <label>I agree to the terms & conditions</label>
            <input type="checkbox" />
          </div>
          
          <button type="submit">Register</button>
          
        </form>

        <div className='Login-link'>
            <Link to="/login">
                <button type="button">Already have an account?</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;