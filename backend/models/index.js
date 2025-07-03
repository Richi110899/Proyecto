const sequelize = require('../config/database');
const Especialidad = require('./especialidad');
const TipoMedic = require('./tipoMedic');
const Laboratorio = require('./laboratorio');
const Medicamento = require('./medicamento');
const OrdenVenta = require('./ordenVenta');
const DetalleOrdenVta = require('./detalleOrdenVta');
const OrdenCompra = require('./ordenCompra');
const DetalleOrdenCompra = require('./detalleOrdenCompra');

// Relaciones
TipoMedic.hasMany(Medicamento, { foreignKey: 'CodTipoMed' });
Medicamento.belongsTo(TipoMedic, { foreignKey: 'CodTipoMed' });

Especialidad.hasMany(Medicamento, { foreignKey: 'CodEspec' });
Medicamento.belongsTo(Especialidad, { foreignKey: 'CodEspec' });

Medicamento.hasMany(DetalleOrdenVta, { foreignKey: 'CodMedicamento' });
DetalleOrdenVta.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

OrdenVenta.hasMany(DetalleOrdenVta, { foreignKey: 'NroOrdenVta' });
DetalleOrdenVta.belongsTo(OrdenVenta, { foreignKey: 'NroOrdenVta' });

Laboratorio.hasMany(OrdenCompra, { foreignKey: 'CodLab' });
OrdenCompra.belongsTo(Laboratorio, { foreignKey: 'CodLab' });

Medicamento.hasMany(DetalleOrdenCompra, { foreignKey: 'CodMedicamento' });
DetalleOrdenCompra.belongsTo(Medicamento, { foreignKey: 'CodMedicamento' });

OrdenCompra.hasMany(DetalleOrdenCompra, { foreignKey: 'NroOrdenC' });
DetalleOrdenCompra.belongsTo(OrdenCompra, { foreignKey: 'NroOrdenC' });

module.exports = {
  sequelize,
  Especialidad,
  TipoMedic,
  Laboratorio,
  Medicamento,
  OrdenVenta,
  DetalleOrdenVta,
  OrdenCompra,
  DetalleOrdenCompra
};