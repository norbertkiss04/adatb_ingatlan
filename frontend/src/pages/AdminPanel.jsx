import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "../styles/adminPanel.css";

const AdminPanel = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("Ház");
  const [size, setSize] = useState("");
  const [rooms, setRooms] = useState("");
  const [city, setCity] = useState("");
  const [features, setFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [featureName, setFeatureName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/features");
        setFeatures(response.data);
      } catch (err) {
        console.error("Nem sikerült betölteni a jellemzőket:", err);
      }
    };

    fetchFeatures();
  }, []);

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures((prevSelected) =>
      prevSelected.includes(featureId)
        ? prevSelected.filter((id) => id !== featureId)
        : [...prevSelected, featureId]
    );
  };

  const handleAddProperty = async (e) => {
    e.preventDefault();
    try {
      const propertyResponse = await axios.post(
        "http://localhost:3000/api/properties",
        {
          title,
          description,
          price,
          property_type: propertyType,
          size,
          rooms,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const propertyId = propertyResponse.data.property_id;

      await Promise.all(
        selectedFeatures.map((featureId) =>
          axios.post(
            "http://localhost:3000/api/features/assign",
            { property_id: propertyId, feature_id: featureId },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        )
      );

      setMessage("Az ingatlan sikeresen hozzá lett adva!");
    } catch (err) {
      console.error(err);
      setMessage("Nem sikerült hozzáadni az ingatlant.");
    }
  };

  const handleAddFeature = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/features",
        { feature_name: featureName },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("A jellemző sikeresen hozzá lett adva!");
    } catch (err) {
      console.error(err);
      setMessage("Nem sikerült hozzáadni a jellemzőt.");
    }
  };

  return (
    <main className="container">
      <h1 className="title">Admin Panel</h1>
      {message && <p className="message">{message}</p>}
      <section className="form-section">
        <h2 className="section-title">Új ingatlan hozzáadása</h2>
        <form onSubmit={handleAddProperty} className="form">
          <input
            type="text"
            placeholder="Cím"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Leírás"
            className="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="grid">
            <input
              type="number"
              placeholder="Ár"
              className="input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              max="9999"
              required
            />
            <select
              className="select"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
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
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              min="1"
              max="10"
              required
            />
            <input
              type="text"
              placeholder="Város"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Méret (m²)"
              className="input"
              value={size}
              onChange={(e) => setSize(e.target.value)}
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
            Ingatlan hozzáadása
          </button>
        </form>
      </section>
      <section>
        <h2 className="section-title">Új jellemző hozzáadása</h2>
        <form onSubmit={handleAddFeature} className="form">
          <input
            type="text"
            placeholder="Jellemző neve"
            className="input"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Jellemző hozzáadása
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminPanel;
