const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcionMed: DataTypes.STRING,
  fechaFabricacion: DataTypes.DATE,
  fechaVencimiento: DataTypes.DATE,
  Presentacion: DataTypes.STRING,
  stock: DataTypes.INTEGER,
  precioVentaUni: DataTypes.DECIMAL(10,2),
  precioVentaPres: DataTypes.DECIMAL(10,2),
  CodTipoMed: DataTypes.INTEGER,
  Marca: DataTypes.STRING,
  CodEspec: DataTypes.INTEGER,
}, { tableName: 'Medicamento', timestamps: false });

module.exports = Medicamento;