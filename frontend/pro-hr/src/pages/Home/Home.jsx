import React from 'react';
import './Home.css'; 
import image from '/src/assets/homeimg.png'; 
import { Link } from "react-router-dom"


const Home = () => {
  return (
    <div className="container">
      <div className="image-container">
        <img src={image} alt="Team" className="main-image" />
      </div>
      <div className="description">
        <div className="header">
          <h1>Efficient <span>HR Management</span> at Your Fingertips</h1>
          <h2>Secure and Intuitive HR Dashboard</h2>
        </div>
        <div className="cta">
        <Link to="/login" className="link-style"><button className="cta-button">Get Started Now</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
