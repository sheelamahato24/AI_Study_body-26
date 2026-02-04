import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          localStorage.setItem("token", data.token);
          alert(data.message);
          navigate("/");
        } else {
          alert(data.message); // 👈 yahin "You don't have an account" ya "Wrong password" aayega
        }
      })
      .catch(() => {
        alert("Login failed");
      });
  };

  return (
    <div className="auth-overlay">
      <div className="box">
        <h2>Welcome back</h2>
        <p>Please sign in to continue</p>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />

        <button onClick={handleLogin}>Login</button>

        <h5>
          Don't have an account? <Link to="/signup">Signup</Link>
        </h5>
      </div>
    </div>
  );
}

export default Login;
