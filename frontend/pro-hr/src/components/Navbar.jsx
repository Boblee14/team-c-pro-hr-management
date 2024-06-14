import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import './components.css';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="navbar">
      <div className="link-login-head">
        <h1 className="login-head" >Pro HR</h1>
      </div>
      <div className="link-style-div">
        {isAuthenticated ? (
          <button className="login-nav" onClick={logout}>Logout</button>
        ) : (
          <Link to="/login" className="link-style">
            <button className="login-nav">Login</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
