const express = require('express');
const router = express.Router();
const { verificarToken, soloAdmin } = require('../middleware/authMiddleware'); 
const Curso = require('../models/Curso.models');
const Usuario = require('../models/Usuario.models');


// Obtener todos los cursos con profesor
router.get('/', verificarToken, async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [{ model: Usuario, as: 'profesor', attributes: ['nombres', 'apellidos', 'dni'] }]
    });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cursos' });
  }
});

// Crear curso usando DNI del profesor
router.post('/', verificarToken, async (req, res) => {
  try {
    const { nombre, descripcion, activo, dni_profesor } = req.body;

    // Buscar profesor por DNI
    const profesor = await Usuario.findOne({ where: { dni: dni_profesor } });
    if (!profesor) {
      return res.status(404).json({ error: 'Profesor no encontrado con ese DNI' });
    }

    const nuevoCurso = await Curso.create({
      nombre,
      descripcion,
      activo,
      profesor_id: profesor.id
    });

    res.status(201).json(nuevoCurso);
  } catch (error) {
  console.error('Error al crear curso:', error);
  res.status(500).json({ error: 'Error al crear curso', detalle: error.message });
}
});
// Eliminar curso
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    await curso.destroy();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({ error: 'Error al eliminar curso', detalle: error.message });
  }
});

// Editar curso (incluye profesor por DNI)
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, activo, dni_profesor } = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });

    let profesor_id = curso.profesor_id;
    if (dni_profesor) {
      const profesor = await Usuario.findOne({ where: { dni: dni_profesor } });
      if (!profesor) return res.status(404).json({ error: 'Profesor no encontrado con ese DNI' });
      profesor_id = profesor.id;
    }

    await curso.update({
      nombre: nombre ?? curso.nombre,
      descripcion: descripcion ?? curso.descripcion,
      activo: activo ?? curso.activo,
      profesor_id

    });

    res.json({ message: 'Curso actualizado correctamente', curso });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar curso' });
  }
});

module.exports = router;
