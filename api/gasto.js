const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const GASTOS_FILE = 'data/gastos.json';

// GET /gasto - Obtener todos los gastos
router.get('/', (req, res) => {
    try {
        const gastosData = JSON.parse(fs.readFileSync(GASTOS_FILE));
        res.json({ gastos: gastosData.gastos });
    } catch (err) {
        console.error('Error al obtener gastos:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /gasto - Agregar un nuevo gasto
router.post('/', (req, res) => {
    try {
        const { roommate, descripcion, monto } = req.body;
        const gasto = { id: uuidv4(), roommate, descripcion, monto };

        const gastosData = JSON.parse(fs.readFileSync(GASTOS_FILE));
        gastosData.gastos.push(gasto);

        fs.writeFileSync(GASTOS_FILE, JSON.stringify(gastosData, null, 2));

        // Aquí podrías implementar el envío de correo opcional

        res.status(201).json({ message: 'Gasto registrado correctamente' });
    } catch (err) {
        console.error('Error al agregar gasto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// PUT /gasto - Actualizar un gasto existente
router.put('/', (req, res) => {
    try {
        const { id, roommate, descripcion, monto } = req.body;

        const gastosData = JSON.parse(fs.readFileSync(GASTOS_FILE));
        const index = gastosData.gastos.findIndex((g) => g.id === id);
        if (index !== -1) {
            gastosData.gastos[index] = { id, roommate, descripcion, monto };
            fs.writeFileSync(GASTOS_FILE, JSON.stringify(gastosData, null, 2));
            res.json({ message: 'Gasto actualizado correctamente' });
        } else {
            res.status(404).json({ error: 'Gasto no encontrado' });
        }
    } catch (err) {
        console.error('Error al actualizar gasto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// DELETE /gasto - Eliminar un gasto
router.delete('/', (req, res) => {
    try {
        const { id } = req.query;

        const gastosData = JSON.parse(fs.readFileSync(GASTOS_FILE));
        const filteredGastos = gastosData.gastos.filter((g) => g.id !== id);
        if (filteredGastos.length < gastosData.gastos.length) {
            gastosData.gastos = filteredGastos;
            fs.writeFileSync(GASTOS_FILE, JSON.stringify(gastosData, null, 2));
            res.json({ message: 'Gasto eliminado correctamente' });
        } else {
            res.status(404).json({ error: 'Gasto no encontrado' });
        }
    } catch (err) {
        console.error('Error al eliminar gasto:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
