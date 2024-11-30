const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Hozzáférés megtagadva, token szükséges.');
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (err) {
        res.status(403).send('Érvénytelen vagy lejárt token.');
    }
};

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
