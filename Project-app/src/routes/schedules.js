const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Use os nomes corretos das funções exportadas:
router.post('/', scheduleController.criarHorario);
router.get('/:id_usuario', scheduleController.listarHorarios);

module.exports = router;