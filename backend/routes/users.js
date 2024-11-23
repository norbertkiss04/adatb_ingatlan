const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');


// Felhasználó regisztrációja
router.post('/register', async (req, res) => {
    const { email, password, full_name, isAdmin } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (email, password_hash, full_name, isAdmin) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, full_name, isAdmin || false]
        );
        res.status(201).send('Regisztráció sikeres.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a regisztráció során.');
    }
});

// Bejelentkezés
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).send('Felhasználó nem található.');
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).send('Hibás jelszó.');
        }

        // Token generálása
        const token = jwt.sign(
            { user_id: user.user_id, role: user.isAdmin ? 'admin' : 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { user_id: user.user_id, full_name: user.full_name, role: user.isAdmin ? 'admin' : 'user' } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a bejelentkezés során.');
    }
});



module.exports = router;
