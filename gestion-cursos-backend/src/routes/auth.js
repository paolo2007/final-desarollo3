const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario.models');
const { verificarToken } = require('../middleware/authMiddleware');
const router = express.Router();

// LOGIN
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: usuario.id, rol_id: usuario.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        dni: usuario.dni,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        telefono: usuario.telefono,
        vivienda: usuario.vivienda,
        email: usuario.email,
        rol_id: usuario.rol_id,
        carrera: usuario.carrera,
        ciclo: usuario.ciclo
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// REGISTRO
router.post('/register', async (req, res) => {
  const { dni, nombres, apellidos, telefono, vivienda, email, password, rol_id, carrera, ciclo } = req.body;

  try {
    if (rol_id === 1) {
      const adminExistente = await Usuario.findOne({ where: { rol_id: 1 } });
      if (adminExistente) {
        return res.status(403).json({ message: 'Ya existe un administrador en el sistema' });
      }
    }

    if (rol_id === 2) {
      const cantidadProfesores = await Usuario.count({ where: { rol_id: 2 } });
      if (cantidadProfesores >= 5) {
        return res.status(403).json({ message: 'Ya existen 5 profesores registrados. No se pueden crear más.' });
      }
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

    res.json({ message: 'Usuario registrado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
});

// PERFIL DEL USUARIO AUTENTICADO
router.get('/me', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener datos del usuario' });
  }
});

module.exports = router;
