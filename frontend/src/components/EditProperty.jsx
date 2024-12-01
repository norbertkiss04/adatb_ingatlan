import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/adminPanel.css";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [property, setProperty] = useState({});
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/properties/${id}`
        );
        setProperty(response.data);
        setSelectedFeatures(response.data.features.map((f) => f.feature_id));
      } catch (err) {
        console.error("Nem sikerült betölteni az ingatlan adatait:", err);
      }
    };

    const fetchFeatures = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/features");
        setFeatures(response.data);
      } catch (err) {
        console.error("Nem sikerült betölteni a jellemzőket:", err);
      }
    };

    fetchProperty();
    fetchFeatures();
  }, [id]);

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prevSelected) =>
      prevSelected.includes(featureId)
        ? prevSelected.filter((id) => id !== featureId)
        : [...prevSelected, featureId]
    );
  };

  const handleUpdateProperty = async (e) => {
    e.preventDefault();
    try {
      // Update property details
      await axios.put(
        `http://localhost:3000/api/properties/${id}`,
        {
          title: property.title,
          description: property.description,
          price: property.price,
          property_type: property.property_type,
          size: property.size,
          rooms: property.rooms,
          city: property.city,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await axios.post(
        `http://localhost:3000/api/features/update`,
        {
          property_id: id,
          feature_ids: selectedFeatures,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Az ingatlan sikeresen frissítve!");
      navigate(`/`);
    } catch (err) {
      console.error(err);
      setMessage("Nem sikerült frissíteni az ingatlant.");
    }
  };

  return (
    <main className="container">
      <h1 className="title">Ingatlan módosítása</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleUpdateProperty} className="form">
        <input
          type="text"
          placeholder="Cím"
          className="input"
          value={property.title || ""}
          onChange={(e) => setProperty({ ...property, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Leírás"
          className="textarea"
          value={property.description || ""}
          onChange={(e) =>
            setProperty({ ...property, description: e.target.value })
          }
          required
        />
        <div className="grid">
          <input
            type="number"
            placeholder="Ár"
            className="input"
            value={property.price || ""}
            onChange={(e) =>
              setProperty({ ...property, price: e.target.value })
            }
            required
          />
          <select
            className="select"
            value={property.property_type || "Ház"}
            onChange={(e) =>
              setProperty({ ...property, property_type: e.target.value })
            }
            required
          >
            <option value="Ház">Ház</option>
            <option value="Apartman">Apartman</option>
            <option value="Iroda">Iroda</option>
          </select>
          <input
            type="number"
            placeholder="Szobák"
            className="input"
            value={property.rooms || ""}
            onChange={(e) =>
              setProperty({ ...property, rooms: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Város"
            className="input"
            value={property.city || ""}
            onChange={(e) => setProperty({ ...property, city: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Méret (m²)"
            className="input"
            value={property.size || ""}
            onChange={(e) => setProperty({ ...property, size: e.target.value })}
            required
          />
        </div>
        <div>
          <h3 className="section-title">Jellemzők kiválasztása</h3>
          <div className="checkbox-group">
            {features.map((feature) => (
              <label key={feature.feature_id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={feature.feature_id}
                  checked={selectedFeatures.includes(feature.feature_id)}
                  onChange={() => handleFeatureToggle(feature.feature_id)}
                />
                <span>{feature.feature_name}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="button">
          Ingatlan frissítése
        </button>
      </form>
    </main>
  );
};

export default EditProperty;
