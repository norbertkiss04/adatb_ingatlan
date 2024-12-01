const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.get("/me", authenticateToken, usersController.getUserDetails);

module.exports = router;
