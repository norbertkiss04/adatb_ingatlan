const db = require("../config/db");

const getAllProperties = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM properties");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt az adatbázis lekérdezés során.");
  }
};

const addProperty = async (req, res) => {
  const { title, description, price, property_type, size, rooms, city } =
    req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO properties (title, description, price, property_type, size, rooms, city) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, price, property_type, size, rooms, city]
    );
    res.status(201).json({ property_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt az ingatlan hozzáadása során.");
  }
};

const getPropertyDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const [propertyRows] = await db.query(
      "SELECT * FROM properties WHERE property_id = ?",
      [id]
    );
    if (propertyRows.length === 0) {
      return res.status(404).send("Ingatlan nem található.");
    }
    const property = propertyRows[0];

    const [features] = await db.query(
      `SELECT f.feature_name 
             FROM property_features pf 
             JOIN features f ON pf.feature_id = f.feature_id 
             WHERE pf.property_id = ?`,
      [id]
    );

    property.features = features.map((feature) => feature.feature_name);

    res.json(property);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Hiba történt az ingatlan részleteinek lekérése során.");
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM property_features WHERE property_id = ?", [id]);
    await db.query("DELETE FROM favorites WHERE property_id = ?", [id]);
    const [result] = await db.query(
      "DELETE FROM properties WHERE property_id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Ingatlan nem található.");
    }
    res.send("Ingatlan sikeresen törölve.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt az ingatlan törlése során.");
  }
};

module.exports = {
  getAllProperties,
  addProperty,
  getPropertyDetails,
  deleteProperty,
};
