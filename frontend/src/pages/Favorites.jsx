import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import "../styles/favorites.css";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/favorites/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (err) {
        setError("Nem sikerült betölteni a kedvenceket.");
      }
    };

    fetchFavorites();
  }, [user, navigate]);

  const handleUnfavorite = async (propertyId) => {
    try {
      await axios.delete(`http://localhost:3000/api/favorites/unassign`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: { user_id: user.user_id, property_id: propertyId },
      });
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.property_id !== propertyId)
      );
    } catch (err) {
      console.error("Nem sikerült eltávolítani a kedvencek közül.");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <main className="container">
      <h1 className="title">Kedvenceim</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="favorites-grid">
        {favorites.map((property) => (
          <div key={property.property_id} className="favorite-card">
            <PropertyCard property={property} />
            <button
              onClick={() => handleUnfavorite(property.property_id)}
              className="remove-button"
            >
              Eltávolítás a kedvencekből
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Favorites;
