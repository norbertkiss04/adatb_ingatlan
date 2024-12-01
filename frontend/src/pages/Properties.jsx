import React, { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/properties.css";

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/properties"
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    const fetchFavorites = async () => {
      if (!user) return;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/favorites/${user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setFavorites(response.data.map((fav) => fav.property_id));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchProperties();
    fetchFavorites();
  }, [user]);

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFavoriteToggle = (propertyId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(propertyId)
        ? prevFavorites.filter((id) => id !== propertyId)
        : [...prevFavorites, propertyId]
    );
  };

  return (
    <main className="container">
      <h1 className="title">Ingatlanok felfedezése</h1>
      <input
        type="text"
        placeholder="Keresés cím vagy város alapján"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="property-grid">
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.property_id}
            property={property}
            isFavorite={favorites.includes(property.property_id)}
            onFavoriteToggle={handleFavoriteToggle}
          />
        ))}
      </div>
    </main>
  );
};

export default Properties;
