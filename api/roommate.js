const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const randomUser = require('./randomuser');

const router = express.Router();
const ROOMMATES_FILE = 'data/roommates.json';

// GET /roommate - Obtener todos los roommates
router.get('/', (req, res) => {
    try {
        const roommatesData = JSON.parse(fs.readFileSync(ROOMMATES_FILE));
        res.json({ roommates: roommatesData.roommates });
    } catch (err) {
        console.error('Error al obtener roommates:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /roommate - Agregar un nuevo roommate
router.post('/', async (req, res) => {
    try {
        const newRoommate = await randomUser.getRandomUser();
        newRoommate.id = uuidv4();

        const roommatesData = JSON.parse(fs.readFileSync(ROOMMATES_FILE));
        roommatesData.roommates.push(newRoommate);

        fs.writeFileSync(ROOMMATES_FILE, JSON.stringify(roommatesData, null, 2));

        res.status(201).json({ message: 'Roommate agregado correctamente' });
    } catch (err) {
        console.error('Error al agregar roommate:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;

