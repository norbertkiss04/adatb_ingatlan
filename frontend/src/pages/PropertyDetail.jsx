import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const handleDeleteProperty = async () => {
    const confirmDelete = window.confirm(
      "Biztosan törölni szeretnéd ezt az ingatlant?"
    );
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/api/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        alert("Az ingatlan sikeresen törölve lett.");
        navigate("/");
      } catch (err) {
        console.error(err);
        alert("Nem sikerült törölni az ingatlant.");
      }
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
            <div className="property-features">
              <h3>Jellemzők:</h3>
              {property.features && property.features.length > 0 ? (
                <ul>
                  {property.features.map((feature) => (
                    <li key={feature.feature_id}>{feature.feature_name}</li>
                  ))}
                </ul>
              ) : (
                <p>Nincsenek jellemzők.</p>
              )}
            </div>
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
          {user?.role === "admin" && (
            <button onClick={handleDeleteProperty} className="delete-button">
              Törlés
            </button>
          )}
          {user?.role === "admin" && (
            <button className="edit-button">
              <Link to={`/properties/edit/${id}`}>Módosítás</Link>
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;
