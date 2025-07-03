const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoMedic = sequelize.define('TipoMedic', {
  CodTipoMed: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcion: DataTypes.STRING,
}, { tableName: 'TipoMedic', timestamps: false });

module.exports = TipoMedic;