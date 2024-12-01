const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { email, password, full_name, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (email, password_hash, full_name, isAdmin) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, full_name, isAdmin || false]
    );
    res.status(201).send("Regisztráció sikeres.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a regisztráció során.");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).send("Felhasználó nem található.");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).send("Hibás jelszó.");
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.isAdmin ? "admin" : "user" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        role: user.isAdmin ? "admin" : "user",
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Hiba történt a bejelentkezés során.");
  }
};

const getUserDetails = async (req, res) => {
  try {
    const { user_id, full_name, email, isAdmin } = req.user;
    res.json({ user_id, full_name, email, role: isAdmin ? "admin" : "user" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch user details.");
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserDetails,
};
