import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

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
        setError("Failed to fetch property details.");
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, user]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      setError("You must be logged in to favorite this property.");
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
      setError("Failed to update favorite status.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <main className="container mx-auto px-4 py-8">
      <Link to="/properties" className="text-blue-600 hover:underline">
        &larr; Back to Properties
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800">{property.title}</h1>
          <p className="text-lg text-gray-500">{property.city}</p>
          <p className="text-gray-700 mt-4">{property.description}</p>
          <div className="mt-6">
            <p className="text-xl text-blue-600 font-bold">{`$${property.price}`}</p>
            <p className="text-gray-600">{`Type: ${property.property_type}`}</p>
            <p className="text-gray-600">{`Size: ${property.size} m²`}</p>
            <p className="text-gray-600">{`Rooms: ${property.rooms}`}</p>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`mt-4 px-4 py-2 rounded-md ${
              isFavorite ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            {isFavorite ? "Unfavorite" : "Favorite"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;
