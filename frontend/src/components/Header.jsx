import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/header.css";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <h1>
          <Link to="/">Ingatlan Alkalmazás</Link>
        </h1>
        <ul>
          <li>
            <Link to="/">Ingatlanok</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/favorites">Kedvencek</Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin">Admin Panel</Link>
                </li>
              )}
              <li>
                <button onClick={logout}>Kijelentkezés</button>
              </li>
              <li>
                <span>{user.full_name}</span>
              </li>
            </>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login">Bejelentkezés</Link>
              </li>
              <li>
                <Link to="/register">Regisztráció</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
