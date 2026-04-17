require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/database');

// Importar rutas
const cursoRoutes = require('./src/routes/curso');
const usuarioRoutes = require('./src/routes/Usuario');
const authRoutes = require('./src/routes/auth');

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de autenticación (login/register)
app.use('/login', authRoutes);

// Rutas de usuarios (roles definidos dentro del router)
app.use('/usuario', usuarioRoutes);

// Rutas de cursos (roles definidos dentro del router)
app.use('/cursos', cursoRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la BD exitosa');
  } catch (error) {
    console.error('Error al conectar a la BD:', error);
  }
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
