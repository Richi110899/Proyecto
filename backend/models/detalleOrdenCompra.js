const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleOrdenCompra = sequelize.define('DetalleOrdenCompra', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  NroOrdenC: DataTypes.INTEGER,
  CodMedicamento: DataTypes.INTEGER,
  descripcion: DataTypes.STRING,
  cantidad: DataTypes.INTEGER,
  precio: DataTypes.DECIMAL(10,2),
  montouni: DataTypes.DECIMAL(10,2),
}, { tableName: 'DetalleOrdenCompra', timestamps: false });

module.exports = DetalleOrdenCompra;