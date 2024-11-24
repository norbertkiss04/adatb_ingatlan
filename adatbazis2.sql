
-- Drop tables if they already exist
DROP TABLE IF EXISTS property_features;
DROP TABLE IF EXISTS features;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS favorites;

-- Creating tables
CREATE TABLE properties (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    size INT NOT NULL,
    rooms SMALLINT NOT NULL,
    city VARCHAR(100) NOT NULL
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    isAdmin BOOLEAN NOT NULL
);

CREATE TABLE favorites (
    favorite_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    property_id INT NOT NULL,
    UNIQUE(user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (property_id) REFERENCES properties(property_id)
);

CREATE TABLE features (
    feature_id INT AUTO_INCREMENT PRIMARY KEY,
    feature_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE property_features (
    property_feature_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    feature_id INT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(property_id),
    FOREIGN KEY (feature_id) REFERENCES features(feature_id)
);

-- Populating tables with data
-- Insert data into properties
INSERT INTO properties (title, description, price, property_type, size, rooms, city) VALUES
('Cozy Apartment', 'A small cozy apartment in the city center.', 150000, 'Apartment', 45, 2, 'Budapest'),
('Spacious Villa', 'A luxurious villa with a pool.', 450000, 'Villa', 300, 6, 'Debrecen'),
('Modern Office', 'A modern office space for startups.', 200000, 'Office', 100, 3, 'Szeged'),
('Family House', 'Perfect for families, close to schools.', 250000, 'House', 120, 4, 'Pécs'),
('Beachside Bungalow', 'A beautiful bungalow by the beach.', 350000, 'Bungalow', 80, 3, 'Siófok'),
('Studio Apartment', 'Compact studio for singles.', 90000, 'Apartment', 30, 1, 'Budapest'),
('Historic Cottage', 'A charming historic cottage.', 120000, 'Cottage', 70, 2, 'Győr'),
('Suburban House', 'Great for families in the suburbs.', 220000, 'House', 110, 4, 'Szeged'),
('Luxury Penthouse', 'Stunning views and high-end finishes.', 500000, 'Penthouse', 150, 5, 'Budapest'),
('Rustic Farmhouse', 'Countryside living at its best.', 180000, 'Farmhouse', 140, 4, 'Eger');

-- Insert data into users
INSERT INTO users (email, password_hash, full_name, isAdmin) VALUES
('admin@example.com', 'hashed_password1', 'Admin User', TRUE),
('user1@example.com', 'hashed_password2', 'John Doe', FALSE),
('user2@example.com', 'hashed_password3', 'Jane Smith', FALSE),
('user3@example.com', 'hashed_password4', 'Alice Brown', FALSE),
('user4@example.com', 'hashed_password5', 'Bob Johnson', FALSE);

-- Insert data into favorites
INSERT INTO favorites (user_id, property_id) VALUES
(2, 1),
(2, 3),
(3, 4),
(4, 2),
(5, 5);

-- Insert data into features
INSERT INTO features (feature_name) VALUES
('Balcony'),
('Elevator'),
('Swimming Pool'),
('Garage'),
('Conference Room'),
('Garden'),
('Sea View'),
('Air Conditioning'),
('Central Heating'),
('Fireplace'),
('Solar Panels'),
('Smart Home System'),
('Barn');

-- Insert data into property_features
INSERT INTO property_features (property_id, feature_id) VALUES
(1, 1), -- Cozy Apartment: Balcony
(1, 2), -- Cozy Apartment: Elevator
(2, 3), -- Spacious Villa: Swimming Pool
(2, 4), -- Spacious Villa: Garage
(3, 5), -- Modern Office: Conference Room
(4, 6), -- Family House: Garden
(5, 7), -- Beachside Bungalow: Sea View
(5, 8), -- Beachside Bungalow: Air Conditioning
(6, 9), -- Studio Apartment: Central Heating
(7, 10), -- Historic Cottage: Fireplace
(8, 11), -- Suburban House: Solar Panels
(9, 12), -- Luxury Penthouse: Smart Home System
(10, 13); -- Rustic Farmhouse: Barn
