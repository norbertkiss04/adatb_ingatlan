import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/propertyDetail.css";

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/properties/${id}`
        );
        setProperty(response.data);

        if (user) {
          const favoriteResponse = await axios.get(
            `http://localhost:3000/api/favorites/${user.user_id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setIsFavorite(
            favoriteResponse.data.some(
              (fav) => fav.property_id === parseInt(id)
            )
          );
        }

        setLoading(false);
      } catch (err) {
        setError("Nem sikerült betölteni az ingatlan adatait.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      setError("Be kell jelentkezned, hogy kedvencekhez add az ingatlant.");
      return;
    }

    try {
      const url = isFavorite
        ? `http://localhost:3000/api/favorites/unassign`
        : `http://localhost:3000/api/favorites`;

      const method = isFavorite ? "DELETE" : "POST";

      await axios({
        method,
        url,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        data: {
          user_id: user.user_id,
          property_id: parseInt(id),
        },
      });

      setIsFavorite(!isFavorite);
    } catch (err) {
      setError("Nem sikerült frissíteni a kedvencek állapotát.");
    }
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="container">
      <Link to="/" className="back-link">
        &larr; Vissza az ingatlanokhoz
      </Link>
      <div className="property-card">
        <div className="property-content">
          <h1 className="property-title">{property.title}</h1>
          <p className="property-city">{property.city}</p>
          <p className="property-description">{property.description}</p>
          <div className="property-details">
            <p className="property-price">{`$${property.price}`}</p>
            <p>{`Típus: ${property.property_type}`}</p>
            <p>{`Méret: ${property.size} m²`}</p>
            <p>{`Szobák: ${property.rooms}`}</p>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`favorite-button ${
              isFavorite ? "favorite" : "not-favorite"
            }`}
          >
            {isFavorite
              ? "Eltávolítás a kedvencekből"
              : "Hozzáadás a kedvencekhez"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;
