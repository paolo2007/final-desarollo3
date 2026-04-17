const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  dni: { type: DataTypes.STRING, allowNull: false, unique: true },
  nombres: { type: DataTypes.STRING, allowNull: false },
  apellidos: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: false },
  vivienda: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol_id: { type: DataTypes.INTEGER, allowNull: false },
  carrera: { type: DataTypes.STRING, allowNull: false },
  ciclo: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
