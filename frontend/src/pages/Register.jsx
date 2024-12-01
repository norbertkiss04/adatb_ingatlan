import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/users/register", {
        email,
        password,
        full_name: fullName,
      });
      navigate("/login");
    } catch (err) {
      setError("A regisztráció sikertelen. Kérjük, próbálja újra.");
    }
  };

  return (
    <main className="register-container">
      <div className="register-box">
        <h1 className="register-title">Regisztráció</h1>
        {error && <p className="register-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Teljes név"
            className="register-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Jelszó"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button">
            Regisztráció
          </button>
        </form>
        <p className="register-footer">
          Már van fiókod? <a href="/login">Bejelentkezés</a>
        </p>
      </div>
    </main>
  );
};

export default Register;
