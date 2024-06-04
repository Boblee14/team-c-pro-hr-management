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

      <div className="link-style-div">
        <Link to="/login" className="link-style"><button className="login-nav">Login</button></Link>
      </div>
    </div>
  )
}

export default Navbar