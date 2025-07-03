const express = require('express');
const router = express.Router();
const detalleOrdenVtaController = require('../controllers/detalleOrdenVtaController');

// Rutas para operaciones CRUD sobre DetalleOrdenVta
router.get('/', detalleOrdenVtaController.getAll);
router.post('/', detalleOrdenVtaController.create);
router.put('/:id', detalleOrdenVtaController.update);
router.delete('/orden/:nroOrden', detalleOrdenVtaController.deleteByOrden);
router.delete('/:id', detalleOrdenVtaController.delete);

module.exports = router;
