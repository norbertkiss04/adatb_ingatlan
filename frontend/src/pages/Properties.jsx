import React, { useState, useEffect } from "react";
import PropertyCard from "../components/PropertyCard";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Explore Properties
      </h1>
      <input
        type="text"
        placeholder="Search by title or city"
        className="w-full mb-6 px-4 py-2 border rounded-md"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
