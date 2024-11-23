const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// Ingatlanok lekérése
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM properties');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt az adatbázis lekérdezés során.');
    }
});

// Új ingatlan hozzáadása
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { title, description, price, property_type, size, rooms, city } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO properties (title, description, price, property_type, size, rooms, city) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, description, price, property_type, size, rooms, city]
        );
        res.status(201).json({ property_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt az ingatlan hozzáadása során.');
    }
});

// Egy ingatlan részleteinek lekérése
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM properties WHERE property_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).send('Ingatlan nem található.');
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt az ingatlan részleteinek lekérése során.');
    }
});

// Egy ingatlan törlése
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM property_features WHERE property_id = ?', [id]);
        await db.query('DELETE FROM favorites WHERE property_id = ?', [id]);

        const [result] = await db.query('DELETE FROM properties WHERE property_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).send('Ingatlan nem található.');
        }
        res.send('Ingatlan sikeresen törölve.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt az ingatlan törlése során.');
    }
});


module.exports = router;
