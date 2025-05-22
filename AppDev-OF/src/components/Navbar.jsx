import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../src/styles/Navbar.css';
import OnlyFriendsLogo from '../../src/img/OnlyFriends-logo.png';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    alert('You have logged out.');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={OnlyFriendsLogo} alt="OnlyFriends Logo" className="navbar-logo" />
        <h2 className="dash-logo">OnlyFriends</h2>
      </div>
      <div className="nav-right">
        <ul>
          <li><a href="/dashboard">Home</a></li>
          <li><a href="/profile">Profile</a></li>
          <li><a href="/settings">Settings</a></li>
          <li><a href="/admin" className="admin-link">Admin</a></li>
        </ul>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
