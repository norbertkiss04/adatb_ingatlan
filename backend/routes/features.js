const express = require("express");
const router = express.Router();
const featuresController = require("../controllers/featuresController");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

router.get("/", featuresController.listFeatures);
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  featuresController.addFeature
);
router.post(
  "/assign",
  authenticateToken,
  authorizeRoles("admin"),
  featuresController.assignFeature
);
router.get("/property/:property_id", featuresController.getPropertyFeatures);
router.delete(
  "/unassign",
  authenticateToken,
  authorizeRoles("admin"),
  featuresController.unassignFeature
);

router.post(
  "/update",
  authenticateToken,
  authorizeRoles("admin"),
  featuresController.updateFeatures
);

module.exports = router;
