import { Link } from "react-router-dom"
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
      <div>
        <Link to="/" style={{textDecoration: 'none', cursor: 'pointer'}}>
          <h1 style={{color: 'black'}}>HR Management</h1>
        </Link>
      </div>

      {/* <div className="link-style-div">
        <Link to="/login" className="link-style">Login</Link>
        <Link to="/register" className="link-style">Register</Link>
      </div> */}
    </div>
  )
}

export default Navbar