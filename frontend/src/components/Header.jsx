import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto flex justify-between items-center py-4">
        <h1 className="text-xl font-bold">
          <Link to="/">Real Estate App</Link>
        </h1>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:underline">
              Properties
            </Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/favorites" className="hover:underline">
                  Favorites
                </Link>
              </li>
              {user.role === "admin" && (
                <li>
                  <Link to="/admin" className="hover:underline">
                    Admin Panel
                  </Link>
                </li>
              )}
              <li>
                <button onClick={logout} className="hover:underline">
                  Logout
                </button>
              </li>
              <li>
                <span className="font-semibold">{user.full_name}</span>
              </li>
            </>
          )}
          {!user && (
            <>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
