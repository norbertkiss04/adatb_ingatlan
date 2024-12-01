import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        }
      );
      login(response.data.user);
      navigate("/");
    } catch (err) {
      setError("Helytelen email vagy jelszó.");
    }
  };

  return (
    <main className="login-container">
      <div className="login-box">
        <h1 className="login-title">Bejelentkezés</h1>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Jelszó"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Bejelentkezés
          </button>
        </form>
        <p className="login-footer">
          Nincs még fiókod? <a href="/register">Regisztráció</a>
        </p>
      </div>
    </main>
  );
};

export default Login;
