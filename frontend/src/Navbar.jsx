import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="navbar">
      <div className="logo">AIStudy</div>

      <button
        className={`login-btn ${isLoggedIn ? "logout-btn" : ""}`}
        onClick={handleAuthClick}
      >
        {isLoggedIn ? "Logout →" : "Login →"}
      </button>
    </header>
  );
}

export default Navbar;
