import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = () => {
    const { firstName, lastName, email, password } = form;

    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert(data.message);
          navigate("/login");
        } else {
          alert(data.message);
        }
      })
      .catch(() => {
        alert("Signup failed");
      });
  };

  return (
    <div className="auth-overlay">
      <div className="box">
        <h2>Create Account</h2>
        <p>Please sign up to continue</p>

        <input type="text" name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
        <input type="email" name="email" placeholder="Email address" value={form.email} onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />

        <button onClick={handleSignup}>Signup</button>
      </div>
    </div>
  );
}

export default Signup;
