const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrdenCompra = sequelize.define('OrdenCompra', {
  NroOrdenC: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fechaEmision: DataTypes.DATE,
  Situacion: DataTypes.STRING,
  Total: DataTypes.DECIMAL(10,2),
  CodLab: DataTypes.INTEGER,
  NrofacturaProv: DataTypes.STRING,
}, { tableName: 'OrdenCompra', timestamps: false });

module.exports = OrdenCompra;