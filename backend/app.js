require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const favoriteRoutes = require('./routes/favorites');
const featureRoutes = require('./routes/features');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/features', featureRoutes);

app.get('/', (req, res) => {
    res.send('Backend működik!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Szerver fut a ${PORT} porton.`);
});
