import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect unauthenticated users to login
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
        setError("Failed to fetch favorites.");
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
      console.error("Failed to remove favorite.");
    }
  };

  if (!user) {
    return null; // Redirect happening
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Favorites</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((property) => (
          <div key={property.property_id}>
            <PropertyCard property={property} />
            <button
              onClick={() => handleUnfavorite(property.property_id)}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Remove from Favorites
            </button>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Favorites;
