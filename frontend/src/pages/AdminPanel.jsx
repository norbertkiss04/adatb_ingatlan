import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("Haz");
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
        console.error("Failed to fetch features:", err);
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

      // Assign selected features to the property
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

      setMessage("Property added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add property.");
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
      setMessage("Feature added successfully!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add feature.");
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Property</h2>
        <form onSubmit={handleAddProperty} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">$</span>
              <input
                type="number"
                placeholder="Price"
                className="w-full px-4 py-2 border rounded-md"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                max="9999"
                required
              />
            </div>
            <select
              className="w-full px-4 py-2 border rounded-md"
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              required
            >
              <option value="Haz">Haz</option>
              <option value="Apartman">Apartman</option>
              <option value="Iroda">Iroda</option>
            </select>
            <input
              type="number"
              placeholder="Rooms"
              className="w-full px-4 py-2 border rounded-md"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              min="1"
              max="10"
              required
            />
            <input
              type="text"
              placeholder="City"
              className="w-full px-4 py-2 border rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Size"
              className="w-full px-4 py-2 border rounded-md"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              required
            />
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Select Features</h3>
            <div className="flex flex-wrap gap-4">
              {features.map((feature) => (
                <label
                  key={feature.feature_id}
                  className="flex items-center space-x-2"
                >
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
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Property
          </button>
        </form>
      </section>
      <section>
        <h2 className="text-xl font-bold mb-4">Add New Feature</h2>
        <form onSubmit={handleAddFeature} className="space-y-4">
          <input
            type="text"
            placeholder="Feature Name"
            className="w-full px-4 py-2 border rounded-md"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Feature
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminPanel;
