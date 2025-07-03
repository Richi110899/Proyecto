const { OrdenVenta, DetalleOrdenVta } = require('../models');

exports.getAll = async (req, res) => {
  const data = await OrdenVenta.findAll();
  res.json(data);
};

exports.getById = async (req, res) => {
  const data = await OrdenVenta.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  res.json(data);
};

exports.create = async (req, res) => {
  const data = await OrdenVenta.create(req.body);
  res.status(201).json(data);
};

exports.update = async (req, res) => {
  const data = await OrdenVenta.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  await data.update(req.body);
  res.json(data);
};

exports.delete = async (req, res) => {
  const data = await OrdenVenta.findByPk(req.params.id);
  if (!data) return res.status(404).json({ error: 'No encontrado' });
  await data.destroy();
  res.json({ message: 'Eliminado' });
};