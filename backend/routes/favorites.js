const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { authenticateToken } = require("../middlewares/authMiddleware");
const favoritesController = require("../controllers/favoritesController");

router.post("/", authenticateToken, favoritesController.addFavorite);

router.get(
  "/:user_id",
  authenticateToken,
  favoritesController.getFavoritesByUser
);

router.delete("/unassign", authenticateToken, async (req, res) => {
  const { user_id, property_id } = req.body;
  try {
    const [result] = await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND property_id = ?",
      [user_id, property_id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send("Favorite not found.");
    }
    res.send("Favorite removed.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to remove favorite.");
  }
});

module.exports = router;
