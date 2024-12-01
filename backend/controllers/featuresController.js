const db = require("../config/db");

const listFeatures = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM features");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a tulajdonságok lekérése során.");
  }
};

const addFeature = async (req, res) => {
  const { feature_name } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO features (feature_name) VALUES (?)",
      [feature_name]
    );
    res.status(201).json({ feature_id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a tulajdonság hozzáadása során.");
  }
};

const assignFeature = async (req, res) => {
  const { property_id, feature_id } = req.body;
  try {
    await db.query(
      "INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)",
      [property_id, feature_id]
    );
    res.status(201).send("Tulajdonság sikeresen hozzárendelve.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a tulajdonság hozzárendelése során.");
  }
};

const getPropertyFeatures = async (req, res) => {
  const { property_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT f.feature_name 
             FROM property_features pf 
             JOIN features f ON pf.feature_id = f.feature_id 
             WHERE pf.property_id = ?`,
      [property_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send("Hiba történt az ingatlan tulajdonságainak lekérése során.");
  }
};

const unassignFeature = async (req, res) => {
  const { property_id, feature_id } = req.body;
  try {
    const [result] = await db.query(
      "DELETE FROM property_features WHERE property_id = ? AND feature_id = ?",
      [property_id, feature_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send("Kapcsolat nem található.");
    }
    res.send("Tulajdonság sikeresen eltávolítva az ingatlanról.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a tulajdonság eltávolítása során.");
  }
};

const updateFeatures = async (req, res) => {
  const { property_id, feature_ids } = req.body;

  if (!property_id || !Array.isArray(feature_ids)) {
    return res.status(400).send("Hiányzó vagy hibás adatok.");
  }

  try {
    await db.query("DELETE FROM property_features WHERE property_id = ?", [
      property_id,
    ]);

    if (feature_ids.length > 0) {
      const featureValues = feature_ids.map((id) => [property_id, id]);
      await db.query(
        "INSERT INTO property_features (property_id, feature_id) VALUES ?",
        [featureValues]
      );
    }

    res.send("Tulajdonságok sikeresen frissítve.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a tulajdonságok frissítése során.");
  }
};

module.exports = {
  updateFeatures,
  listFeatures,
  addFeature,
  assignFeature,
  getPropertyFeatures,
  unassignFeature,
};
