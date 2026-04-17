const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario.models'); // importa Usuario primero

// Definir el modelo Curso
const Curso = sequelize.define('Curso', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  profesor_id: { type: DataTypes.INTEGER }
}, {
  tableName: 'cursos',
  timestamps: false
});

// Relación con usuarios (después de definir Curso)
Curso.belongsTo(Usuario, { foreignKey: 'profesor_id', as: 'profesor' });

module.exports = Curso;
