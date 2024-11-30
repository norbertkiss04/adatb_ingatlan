const db = require('../config/db');

const addFavorite = async (req, res) => {
    const { user_id, property_id } = req.body;
    try {
        await db.query(
            'INSERT INTO favorites (user_id, property_id) VALUES (?, ?)',
            [user_id, property_id]
        );
        res.status(201).send('Kedvenc hozzáadva.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a kedvenc hozzáadása során.');
    }
};

const getFavoritesByUser = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT p.* FROM favorites f JOIN properties p ON f.property_id = p.property_id WHERE f.user_id = ?',
            [user_id]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Hiba történt a kedvencek lekérése során.');
    }
};

module.exports = {
    addFavorite,
    getFavoritesByUser
};
