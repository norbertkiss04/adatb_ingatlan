const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middlewares/authMiddleware');
const favoritesController = require('../controllers/favoritesController');


router.post('/', authenticateToken, favoritesController.addFavorite);

router.get('/:user_id', authenticateToken, async (req, res, next) => {
    if (req.user.user_id !== parseInt(req.params.user_id) && req.user.role !== 'admin') {
        return res.status(403).send('Nem jogosult a művelet végrehajtására.');
    }
    next();
}, favoritesController.getFavoritesByUser);

module.exports = router;
