const express = require("express");
const router = express.Router();
const propertiesController = require("../controllers/propertiesController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get("/", propertiesController.getAllProperties);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  propertiesController.addProperty
);
router.get("/:id", propertiesController.getPropertyDetails);
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  propertiesController.deleteProperty
);

module.exports = router;
