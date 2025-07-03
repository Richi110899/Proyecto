const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenVta = sequelize.define('DetalleOrdenVta', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NroOrdenVta: DataTypes.INTEGER,
  CodMedicamento: DataTypes.INTEGER,
  descripcionMed: DataTypes.STRING,
  cantidadRequerida: DataTypes.INTEGER,
}, { tableName: 'DetalleOrdenVta', timestamps: false });

module.exports = DetalleOrdenVta;