const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. Tulajdonságok listázása
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM features');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a tulajdonságok lekérése során.');
    }
});

// 2. Új tulajdonság hozzáadása
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    const { feature_name } = req.body;
    try {
        const [result] = await db.query('INSERT INTO features (feature_name) VALUES (?)', [feature_name]);
        res.status(201).json({ feature_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a tulajdonság hozzáadása során.');
    }
});

// 3. Tulajdonságok hozzárendelése ingatlanhoz
router.post('/assign', async (req, res) => {
    const { property_id, feature_id } = req.body;
    try {
        await db.query(
            'INSERT INTO property_features (property_id, feature_id) VALUES (?, ?)',
            [property_id, feature_id]
        );
        res.status(201).send('Tulajdonság sikeresen hozzárendelve.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a tulajdonság hozzárendelése során.');
    }
});

// 4. Egy ingatlanhoz tartozó tulajdonságok lekérése
router.get('/property/:property_id', async (req, res) => {
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
        res.status(500).send('Hiba történt az ingatlan tulajdonságainak lekérése során.');
    }
});

// 5. Tulajdonság eltávolítása egy ingatlanról
router.delete('/unassign', async (req, res) => {
    const { property_id, feature_id } = req.body;
    try {
        const [result] = await db.query(
            'DELETE FROM property_features WHERE property_id = ? AND feature_id = ?',
            [property_id, feature_id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).send('Kapcsolat nem található.');
        }
        res.send('Tulajdonság sikeresen eltávolítva az ingatlanról.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a tulajdonság eltávolítása során.');
    }
});

module.exports = router;
