const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Laboratorio = sequelize.define('Laboratorio', {
  CodLab: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  razonSocial: DataTypes.STRING,
  direccion: DataTypes.STRING,
  telefono: DataTypes.STRING,
  email: DataTypes.STRING,
  contacto: DataTypes.STRING,
}, { tableName: 'Laboratorio', timestamps: false });

module.exports = Laboratorio;