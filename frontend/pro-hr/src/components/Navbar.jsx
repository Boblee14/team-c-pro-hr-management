import { Link } from "react-router-dom"
import './components.css'

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <Link to="/" style={{textDecoration: 'none', cursor: 'pointer'}}>
          <h1 style={{color: '#2c2c2c'}}>Pro HR</h1>
        </Link>
      </div>

<<<<<<< HEAD:frontend/pro-hr/src/components/Navbar.jsx
      <div className="link-style-div">
        <Link to="/login" className="link-style"><button className="login-nav">Login</button></Link>
      </div>
=======
      {/* <div className="link-style-div">
        <Link to="/login" className="link-style">Login</Link>
        <Link to="/register" className="link-style">Register</Link>
      </div> */}
>>>>>>> a98255c782c4c91c51858219429931594b1d4086:frontend/pro-hr/src/components/Navbar/Navbar.jsx
    </div>
  )
}

export default Navbar