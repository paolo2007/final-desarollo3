const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { verificarToken, verificarRol } = require('../middleware/authMiddleware');
const Usuario = require('../models/Usuario.models');

// Obtener todos los usuarios (admin y profesor)
router.get('/', verificarToken, verificarRol([1, 2]), async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios', detalle: error.message });
  }
});

// Crear usuario (admin y profesor pueden crear estudiantes)
router.post('/', verificarToken, verificarRol([1, 2]), async (req, res) => {
  try {
    const { dni, nombres, apellidos, telefono, vivienda, email, password, rol_id, carrera, ciclo } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'La contraseña es obligatoria' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = await Usuario.create({
      dni,
      nombres,
      apellidos,
      telefono,
      vivienda,
      email,
      password: hashedPassword,
      rol_id,
      carrera,
      ciclo
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalle: error.message });
  }
});

// Actualizar usuario (solo admin, con opción de cambiar contraseña)
router.put('/:id', verificarToken, verificarRol([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const { dni, nombres, apellidos, telefono, vivienda, email, rol_id, carrera, ciclo, password } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Campos a actualizar
    let camposActualizados = { dni, nombres, apellidos, telefono, vivienda, email, rol_id, carrera, ciclo };

    // Si viene contraseña nueva, la encriptamos
    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      camposActualizados.password = hashedPassword;
    }

    await usuario.update(camposActualizados);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario', detalle: error.message });
  }
});

// Eliminar usuario (solo admin)
router.delete('/:id', verificarToken, verificarRol([1]), async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario', detalle: error.message });
  }
});

module.exports = router;
