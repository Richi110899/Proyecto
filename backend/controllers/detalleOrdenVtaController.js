const { DetalleOrdenVta, Medicamento, OrdenVenta } = require('../models');
const { Op } = require('sequelize');

// CREAR detalle de orden de venta y actualizar stock
exports.create = async (req, res) => {
  try {
    const detalles = Array.isArray(req.body) ? req.body : [req.body];
    // Map para simular el stock actualizado en memoria
    const stockMap = {};
    // Validar y simular stock antes de crear
    for (const d of detalles) {
      const med = stockMap[d.CodMedicamento] || await Medicamento.findByPk(d.CodMedicamento);
      if (!med) return res.status(400).json({ error: `Medicamento no encontrado (ID: ${d.CodMedicamento})` });
      const stockActual = stockMap[d.CodMedicamento]?.stock ?? med.stock;
      if (Number(d.cantidadRequerida) > stockActual) {
        return res.status(400).json({ error: `Stock insuficiente para el medicamento "${med.descripcionMed}". Disponible: ${stockActual}, solicitado: ${d.cantidadRequerida}` });
      }
      // Simular el stock actualizado en memoria
      stockMap[d.CodMedicamento] = {
        ...med.toJSON(),
        stock: stockActual - Number(d.cantidadRequerida)
      };
    }
    // Si pasa la validación, crear los detalles y actualizar stock real
    const nuevos = await DetalleOrdenVta.bulkCreate(detalles);
    for (const d of detalles) {
      const med = await Medicamento.findByPk(d.CodMedicamento);
      await med.update({ stock: med.stock - Number(d.cantidadRequerida) });
    }
    res.status(201).json(nuevos);
  } catch (error) {
    console.error('Error al crear detalle de orden de venta:', error);
    res.status(400).json({ error: 'Error al crear el detalle de orden de venta' });
  }
};

// EDITAR detalle de orden de venta y actualizar stock
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleOrdenVta.findByPk(id);
    if (!detalle) {
      console.error('No se encontró el detalle con id:', id);
      return res.status(404).json({ error: 'Detalle de orden de venta no encontrado' });
    }
    const med = await Medicamento.findByPk(req.body.CodMedicamento);
    if (!med) {
      console.error('No se encontró el medicamento con id:', req.body.CodMedicamento);
      return res.status(400).json({ error: `Medicamento no encontrado (ID: ${req.body.CodMedicamento})` });
    }
    const cantidadOriginal = detalle.cantidadRequerida;
    const stockActual = med.stock;
    const stockDisponible = stockActual + cantidadOriginal;
    if (Number(req.body.cantidadRequerida) > stockDisponible) {
      console.error('Stock insuficiente:', { stockDisponible, req: req.body, detalle });
      return res.status(400).json({ error: `Stock insuficiente para el medicamento "${med.descripcionMed}". Disponible: ${stockDisponible}, solicitado: ${req.body.cantidadRequerida}` });
    }
    await detalle.update(req.body);
    await med.update({ stock: med.stock - Number(req.body.cantidadRequerida) + Number(cantidadOriginal) });
    res.json(detalle);
  } catch (error) {
    console.error('Error al actualizar detalle de orden de venta:', error);
    res.status(400).json({ error: 'Error al actualizar el detalle de orden de venta' });
  }
};

// ELIMINAR detalle de orden de venta y devolver stock
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const detalle = await DetalleOrdenVta.findByPk(id);
    if (!detalle) {
      console.error('No se encontró el detalle con id:', id);
      return res.status(404).json({ error: 'Detalle de orden de venta no encontrado' });
    }
    const med = await Medicamento.findByPk(detalle.CodMedicamento);
    if (med) {
      await med.update({ stock: med.stock + detalle.cantidadRequerida });
    }
    await detalle.destroy();
    res.json({ message: 'Detalle de orden de venta eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar detalle de orden de venta:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ELIMINAR todos los detalles de una orden de venta por NroOrdenVta
exports.deleteByOrden = async (req, res) => {
  try {
    const { nroOrden } = req.params;
    await DetalleOrdenVta.destroy({ where: { NroOrdenVta: nroOrden } });
    res.json({ message: 'Detalles eliminados' });
  } catch (error) {
    console.error('Error al eliminar detalles de la orden:', error);
    res.status(500).json({ error: 'Error al eliminar los detalles de la orden' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const detalles = await DetalleOrdenVta.findAll();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los detalles de orden de venta' });
  }
};