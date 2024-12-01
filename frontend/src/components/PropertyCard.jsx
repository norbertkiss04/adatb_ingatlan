import React from "react";
import { Link } from "react-router-dom";
import "../styles/propertyCard.css";

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-card-content">
        <h2 className="property-title">{property.title}</h2>
        <p className="property-city">{property.city}</p>
        <p className="property-description">
          {property.description.length > 100
            ? `${property.description.substring(0, 100)}...`
            : property.description}
        </p>
        <div className="property-details">
          <span className="property-price">{`$${property.price}`}</span>
          <span className="property-size">{`${property.size} m²`}</span>
        </div>
        <div className="property-details">
          <Link
            to={`/properties/${property.property_id}`}
            className="property-link"
          >
            Részletek megtekintése
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
