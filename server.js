// server.js

const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { getRandomUser } = require('./api/randomuser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Ruta GET para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta POST para agregar un nuevo roommate usando randomuser
app.post('/roommate', async (req, res) => {
    try {
        const newRoommate = await getRandomUser();
        newRoommate.id = uuidv4();

        const roommatesData = JSON.parse(fs.readFileSync('data/roommates.json'));
        roommatesData.roommates.push(newRoommate);

        fs.writeFileSync('data/roommates.json', JSON.stringify(roommatesData, null, 2));

        res.status(201).json({ message: 'Roommate agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar roommate:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Otras rutas y configuraciones...

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
