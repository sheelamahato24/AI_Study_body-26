import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const handleGetStart = () => {
    const token = localStorage.getItem("token");
    navigate(token ? "/summary" : "/login");
  };

  return (
    <div className="home-wrapper">
      <div className="demo">
        <h1>Learn anything with AI</h1>
        <p>
          Search any topic and get short, easy explanations powered by
          <span> AIStudy</span>
        </p>
        <button className="butun" onClick={handleGetStart}>
          Get Start →
        </button>
      </div>
    </div>
  );
}

export default Home;
