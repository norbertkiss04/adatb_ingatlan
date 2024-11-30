import React, { useState } from "react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property, isFavorite, onFavoriteToggle }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{property.title}</h2>
        <p className="text-sm text-gray-500">{property.city}</p>
        <p className="text-gray-700 text-sm mt-2">
          {property.description.length > 100
            ? `${property.description.substring(0, 100)}...`
            : property.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-blue-600 font-bold">{`$${property.price}`}</span>
          <span className="text-gray-500">{`${property.size} m²`}</span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/properties/${property.property_id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
