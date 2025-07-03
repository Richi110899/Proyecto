const { DetalleOrdenCompra, Medicamento } = require('../models');

exports.getAll = async (req, res) => {
  const data = await DetalleOrdenCompra.findAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await DetalleOrdenCompra.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
};

exports.create = async (req, res) => {
  try {
    const { CodMedicamento, cantidad } = req.body;
    if (!CodMedicamento || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({ error: 'Datos inválidos: medicamento o cantidad' });
    }
    const med = await Medicamento.findByPk(CodMedicamento);
    if (!med) {
      return res.status(400).json({ error: 'Medicamento no encontrado' });
    }
    console.log(`[CREATE] Stock antes: ${med.stock}, cantidad a sumar: ${cantidad}`);
    const data = await DetalleOrdenCompra.create(req.body);
    await med.update({ stock: med.stock + Number(cantidad) });
    const medActualizado = await Medicamento.findByPk(CodMedicamento);
    console.log(`[CREATE] Stock después: ${medActualizado.stock}`);
    res.status(201).json(data);
  } catch (error) {
    console.error('[CREATE] Error:', error);
    res.status(400).json({ error: 'Error al crear el detalle de orden de compra' });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await DetalleOrdenCompra.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    const { CodMedicamento, cantidad } = req.body;
    if (!CodMedicamento || isNaN(Number(cantidad)) || Number(cantidad) <= 0) {
      return res.status(400).json({ error: 'Datos inválidos: medicamento o cantidad' });
    }
    const med = await Medicamento.findByPk(CodMedicamento);
    if (!med) {
      return res.status(400).json({ error: 'Medicamento no encontrado' });
    }
    console.log(`[UPDATE] Stock antes: ${med.stock}, cantidad original: ${data.cantidad}, nueva cantidad: ${cantidad}`);
    await med.update({ stock: med.stock - Number(data.cantidad) + Number(cantidad) });
    const medActualizado = await Medicamento.findByPk(CodMedicamento);
    console.log(`[UPDATE] Stock después: ${medActualizado.stock}`);
    await data.update(req.body);
    res.json(data);
  } catch (error) {
    console.error('[UPDATE] Error:', error);
    res.status(400).json({ error: 'Error al actualizar el detalle de orden de compra' });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await DetalleOrdenCompra.findByPk(req.params.id);
    if (!data) return res.status(404).json({ error: 'No encontrado' });
    const med = await Medicamento.findByPk(data.CodMedicamento);
    if (!med) {
      return res.status(400).json({ error: 'Medicamento no encontrado' });
    }
    console.log(`[DELETE] Stock antes: ${med.stock}, cantidad a restar: ${data.cantidad}`);
    await med.update({ stock: med.stock - Number(data.cantidad) });
    const medActualizado = await Medicamento.findByPk(data.CodMedicamento);
    console.log(`[DELETE] Stock después: ${medActualizado.stock}`);
    await data.destroy();
    res.json({ message: 'Eliminado' });
  } catch (error) {
    console.error('[DELETE] Error:', error);
    res.status(400).json({ error: 'Error al eliminar el detalle de orden de compra' });
  }
};