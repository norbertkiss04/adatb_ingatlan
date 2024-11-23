const jwt = require('jsonwebtoken');

// Hitelesítés ellenőrzése
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Hozzáférés megtagadva, token szükséges.');
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user; // A token adatait mentjük a kérésbe
        next();
    } catch (err) {
        res.status(403).send('Érvénytelen vagy lejárt token.');
    }
};

// Jogosultság ellenőrzése
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Nincs megfelelő jogosultságod.');
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
};
